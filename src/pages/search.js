import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/search.module.css'
import { useState } from 'react'
import List from '../components/ad_list_types/list.js'
import Card from '../components/ad_list_types/card.js'
import list_svg from '../../public/ad_list.svg'
import card_svg from '../../public/ad_cards.svg'
import Modal from '../components/modal.js'
import PageNavBtns from '../components/page-nav-btns.js'

export async function getServerSideProps(context) {
    const maxResultsToDisplay = 10 // amount of search results returned by the server at a time
    let errorMsg = false
    const type = context.query.type
    const region = context.query.reg
    const query = context.query.q
    const order = context.query.ord
    let page = 1
    if(context.query.p != undefined){
        page = context.query.p
    }
    let dbResponse = []
    
    // NOT SURE IF WE KEEP THIS OR NOT. SERVER WOULD NEED ROUTE MODIFICATION SINCE THIS ROUTE RETURNS A TABLE..
    // BUT THE OTHER ROUTE RETURN A TABLE OF OBJECTS. OBVIOUSLY THESE WOULD NEED TO BE HANDLED DIFFERENTLY
    /*if(type === 'all' && region === 'all' && query === '' && order == undefined && page == 0){
        try {
            const dbQuery = await fetch(`http://localhost:8080/ad/`)
            dbResponse = await dbQuery.json()
        } catch(e) {
            errorMsg = true
        }        1page
    } else {*/
        try {
            const dbQuery = await fetch(`http://localhost:8080/ad/withparams/get?type=${type}&region=${region}&order=${order}&page=${page}&query=${query}`)
            dbResponse = await dbQuery.json()
        } catch(e) {
            errorMsg = true
        }        
   // } ---> THIS IS PART OF THE UPPER COMMENTARY
    return { props: { type, region, page, dbResponse, errorMsg, maxResultsToDisplay } }
  }

// this is the search results page that user sees after performing a search. It receives page language translations as props
export default function Search({ translations, type, region, page, dbResponse, errorMsg, maxResultsToDisplay }) {
    const [listStyle, setListStyle] = useState('list')
    const [fetchError, setFetchError] = useState(errorMsg)
    const errorModalMessage = translations.search.dataFetchErrorMessage 

    return (
        <>
            <Head>
                <title>{translations.homepage.metadata.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:site_name" content="Hommatori.fi" />
                <meta property="og:title" content={""} />
                <meta property="og:description" content={""}></meta>
                <meta property="og:type" content="website" />
                <meta property="og:url" content="http://www.hommatori.fi" />
                <meta name="keywords" content={""} />
                <meta name="description" content={""} />
                <link rel="canonical" href="http://www.hommatori.fi/" />
                <link rel="shortcut icon" href="hommatori_favicon.ico" />
                <link rel="icon" href="hommatori_favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.newSearchContainer}>search box</div>
                <div className={styles.filters}>
                    <div className={styles.filter_selectWrapper}>
                        <select className={styles.filter_select} id='filter_select'>
                            <option value={'newest'}>{translations.search.newest}</option>
                            <option value={'oldest'}>{translations.search.oldest}</option>
                            <option value={'lowest_price'}>
                                { type == 'jobseeker' ? translations.search.lowest_salary :
                                type == 'joboffer' ? translations.search.lowest_offer :
                                translations.search.lowest_price }
                            </option>
                            <option value={'higest_price'}>
                                { type == 'jobseeker' ? translations.search.higest_salary :
                                type == 'joboffer' ?translations.search.higest_offer :
                                translations.search.higest_price }
                            </option>
                        </select>
                    </div>
                    <p className={styles.filter_pageNumber}>{translations.search.page}
                        <span> { dbResponse.data != undefined ? parseInt(page) == 0 ? 1 : parseInt(page) : 0}
                        <span> / </span>
                        { dbResponse.data != undefined ? Math.ceil(dbResponse.total_rows / maxResultsToDisplay) : 0 }</span>
                    </p>                
                    <div className={styles.filter_display_wrapper}>
                        <div className={styles.filter_displayBtnLeft} onClick={() => setListStyle('list')} >
                            <Image
                                src={list_svg}
                                alt="list"
                                width={36}
                                height={36}                                
                            />
                        </div>
                        <div className={styles.filter_displayBtnRight} onClick={() => setListStyle('card')} >                            
                            <Image
                                src={card_svg}
                                alt="card"
                                width={28}
                                height={28}                               
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.adListContainer}>
                    {
                        dbResponse.data != undefined ?
                            listStyle === 'list' ?
                                <List data={dbResponse.data} translations={translations} />
                                :
                                <Card data={dbResponse.data} translations={translations} />
                        :
                        <div>
                            <p className={styles.noResultsHeader}>{translations.search.no_results_msg.header}</p>
                            <p className={styles.noResultsTips}>{translations.search.no_results_msg.tips}</p>
                        </div>
                    }
                </div>
                {
                    Math.ceil(dbResponse.total_rows / maxResultsToDisplay) > 1 ?
                        <PageNavBtns
                            total_rows={dbResponse.total_rows}
                            maxResultsToDisplay={maxResultsToDisplay}
                            page={parseInt(page)}
                        />
                        : <></>
                }
                { /* informative modal will be shown if data fetch from server fails */
                    fetchError ? <Modal message={errorModalMessage} closeModal={() => setFetchError(false)} /> : <></> 
                }
            </main>
        </>
    )
}