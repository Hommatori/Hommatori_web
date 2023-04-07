import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/search.module.css'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import List from '../components/ad_list_types/list.js'
import Card from '../components/ad_list_types/card.js'
import list_svg from '../../public/ad_list.svg'
import card_svg from '../../public/ad_cards.svg'

export async function getServerSideProps(context) {
    const type = context.query.type
    const region = context.query.reg
    const query = context.query.q
    const order = context.query.ord
    let offset = 0
    if(context.query.o != undefined){
        offset = context.query.o
    }
    let dbResponse = []
    
    if(type === 'all' && region === 'all' && query === '' && order == undefined && offset == 0){
        const dbQuery = await fetch(`http://localhost:8080/ad/`)
        dbResponse = await dbQuery.json()
    } else {
        const dbQuery = await fetch(`http://localhost:8080/ad/withparams/get?type=${type}&region=${region}&order=${order}&offset=${offset}&query=${query}`)
        dbResponse = await dbQuery.json()
    }

    return { props: { type, region, offset, dbResponse } }
  }

// this is the search results page that user sees after performing a search. It receives page language translations as props
export default function Search({ translations, type, region, offset, dbResponse }) {
    const [listStyle, setListStyle] = useState('list')

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
                                translations.search.higest_price}
                            </option>
                        </select>
                    </div>
                    <p className={styles.filter_pageNumber}>{translations.search.page} <span>{offset == 0 ? 1 : offset} / 2</span></p>
                    <div className={styles.filter_display}>
                        <Image
                            className={styles.display_btn}
                            src={list_svg}
                            alt="list"
                            width={25}
                            height={25}
                            onClick={() => setListStyle('list')}
                        />
                        <Image
                            className={styles.display_btn}
                            src={card_svg}
                            alt="card"
                            width={25}
                            height={25}
                            onClick={() => setListStyle('card')}
                        />
                    </div>
                </div>
                <div className={styles.adListContainer}>
                    { listStyle === 'list' ?
                        <List data={dbResponse} translations={translations} />
                        :
                        <Card data={dbResponse} translations={translations} />
                    }
                </div>
            </main>
        </>
    )
}