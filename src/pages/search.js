import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/search.module.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import List from '../components/ad_list_types/list.js'
import Card from '../components/ad_list_types/card.js'
import list_svg from '../../public/ad_list.svg'
import card_svg from '../../public/ad_cards.svg'
import list_white_svg from '../../public/ad_list_white.svg'
import card_white_svg from '../../public/ad_cards_white.svg'
import Modal from '../components/modal.js'
import ResultNavigation from '../components/page-nav-btns.js'
import regions from '../json/regions.json'

export async function getServerSideProps(context) {
    var address = process.env.NODEJS_URL
    const maxResultsToDisplay = 10 // amount of search results returned by the server at a time
    let errorMsg = false
    const type = context.query.type == null ? null : context.query.type
    const region = context.query.reg == null ? null : context.query.reg
    const query = context.query.q == null ? null : context.query.q
    const order = context.query.ord == null ? null : context.query.ord
    const page = context.query.p == null || context.query.p == undefined ? 1 : context.query.p
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
        const dbQuery = await fetch(`${address}/ad/withparams/get?type=${type}&region=${region}&order=${order}&page=${page}&query=${query}`)
        dbResponse = await dbQuery.json()
    } catch(e) {
        errorMsg = true
    }        
   // } ---> THIS IS PART OF THE UPPER COMMENTARY
    return { props: { query, region, type, page, dbResponse, errorMsg, maxResultsToDisplay } }
}

// this is the search results page that user sees after performing a search. It receives page language translations as props
export default function Search({ query, region, translations, type, page, dbResponse, errorMsg, maxResultsToDisplay }) {

    const [listStyle, setListStyle] = useState('list') // how should results be displayed: as a list or as cards
    const [fetchError, setFetchError] = useState(errorMsg) // boolean value for wether to show error message or not
    const errorModalMessage = translations.search.dataFetchErrorMessage // connection error message stored in json
    const router = useRouter()
    const [screenWidth, setScreenWidth] = useState(1500)

    useEffect(()=> {
        if(query){
            document.getElementById('input').value = query.length != 0 ? query : null
        }
        const handleResize = () => {
            const currentScreenWidth = screen.width
            setScreenWidth(currentScreenWidth)            
        }  
          
        handleResize()    
        window.addEventListener('resize', handleResize)    
        return () => {
            window.removeEventListener('resize', handleResize)
        } 
    }, [])

    // Submit() collects search parameters and enters the search page with URL query params
    function Submit() {
        let input = document.getElementById('input').value
        let region = document.getElementById('region_select').value
        let filter_select = document.getElementById('filter_select').value        
        let ad_type = null
        if (document.getElementById('ad_type_joboffer').checked && document.getElementById('ad_type_jobseeker').checked) {
            ad_type = 'all'
        } else if (document.getElementById('ad_type_joboffer').checked){
            ad_type = 'joboffer'
        } else  if (document.getElementById('ad_type_jobseeker').checked){
            ad_type = 'jobseeker'
        }
        router.push(`/search?type=${ad_type}&reg=${region}&ord=${filter_select}&q=${input}&p=1`)  
    }

    function handleSubmitByEnter(e) {    
        if (e.key === 'Enter') {
          Submit()
        }
    }

    return (
        <>
            <Head>
                <title>{translations.homepage.metadata.title}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta property='og:site_name' content='Hommatori.fi' />
                <meta property='og:title' content={query} />
                <meta property='og:description' content={region + ' ' + query} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='http://www.hommatori.fi' />
                <meta name='keywords' content={query + ', ' + region} />
                <meta name='description' content={region + ' ' + query} />
                <link rel='canonical' href='http://www.hommatori.fi/' />
                <link rel='shortcut icon' href='hommatori_favicon.ico' />
                <link rel='icon' href='hommatori_favicon.ico' />
            </Head>

            <main className={styles.main}>
                <div className={styles.searchWrapper}>
                    <div className={styles.selections_container_top}>
                        <div className={styles.searchbox_input}>
                            <input
                                onKeyUp={(e) => handleSubmitByEnter(e)}
                                className={styles.searchbox_input_field}
                                id='input'
                                type='text'
                                placeholder={translations.homepage.work_awaits_searchbox}                                
                                autoComplete='off'
                            />
                            <p onClick={() => Submit()} className={styles.searchbox_input_submit_btn}>{translations.homepage.get_started}</p>
                        </div>                    
                        <select className={styles.region_select} id='region_select'>
                            <option value={'all'}>{translations.homepage.region_entire_finland}</option>
                            {
                                Object.keys(regions).map((item, index) => {
                                    return <option key={index} value={item} selected={region == item ? 'selected' : null}>{item}</option>
                                })  
                            }
                        </select>                       
                    </div>
                    <div className={styles.selections_container_bottom}>
                            <label className={styles.checkboxContainer}>{translations.homepage.ad_type_offers}
                                <input type='checkbox' id='ad_type_joboffer' defaultChecked={type == null || type == 'all' || type == 'joboffer'}/>
                                <span className={styles.checkmark}></span>
                            </label>
                            <label className={styles.checkboxContainer}>{translations.homepage.ad_type_seekers}
                                <input type='checkbox' id='ad_type_jobseeker' defaultChecked={type == null | type == 'all' || type == 'jobseeker'}/>
                                <span className={styles.checkmark}></span>
                            </label>
                        </div>
                </div>
                <div className={styles.filters}>
                    <div className={styles.filter_selectWrapper}>
                        <select className={styles.filter_select} id='filter_select' onChange={() => Submit()}>
                            <option value={0}>{translations.search.newest}</option>
                            <option value={1}>{translations.search.oldest}</option>
                            <option value={2}>
                                { type == 'jobseeker' ? translations.search.lowest_salary :
                                type == 'joboffer' ? translations.search.lowest_offer :
                                translations.search.lowest_price }
                            </option>
                            <option value={3}>
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
                    { screenWidth > 600 ?
                        <div className={styles.filter_display_wrapper}>
                            <div className={styles.filter_displayBtnLeft} onClick={() => setListStyle('list')} title={translations.search.show_as_list}>
                                {
                                    listStyle === 'list' ? 
                                    <Image
                                        src={list_svg}
                                        alt='list'
                                        fill
                                        style={{ objectFit: 'cover' }}                                 
                                    />
                                    :
                                    <Image
                                        src={list_white_svg}
                                        alt='list'
                                        fill
                                        style={{ objectFit: 'cover' }}                                 
                                    />
                                }                            
                            </div>
                            <div className={styles.filter_displayBtnRight} onClick={() => setListStyle('card')} title={translations.search.show_as_cards}>                            
                                {
                                    listStyle !== 'list' ? 
                                    <Image
                                        src={card_svg}
                                        alt='card'
                                        fill
                                        style={{ objectFit: 'cover' }}                                 
                                    />
                                    :
                                    <Image
                                        src={card_white_svg}
                                        alt='card'
                                        fill
                                        style={{ objectFit: 'cover' }}                                 
                                    />
                                }  
                            </div>
                        </div>
                        : <div/>
                    }
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
                        <ResultNavigation
                            total_rows={dbResponse.total_rows}
                            maxResultsToDisplay={maxResultsToDisplay}
                            page={parseInt(page)}
                            translations={translations.search}
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