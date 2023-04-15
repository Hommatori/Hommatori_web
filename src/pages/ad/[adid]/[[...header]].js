import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from '../../../components/modal.js'
import styles from '../../../styles/ad.module.css'
import Link from 'next/link'

export async function getServerSideProps(context) {
    let errorMsg = false
    const adid = context.query.adid
    let dbResponse = []

    try {            
        const dbQuery = await fetch(`http://localhost:8080/ad/${adid}`)
        dbResponse = await dbQuery.json()
    } catch(e) {
        errorMsg = true
    }
    return { props: { dbResponse, errorMsg } }
  }

// this is a single ad page
export default function Ad({ translations, dbResponse, errorMsg }) {
    const [fetchError, setFetchError] = useState(errorMsg) // boolean value for wether to show error message or not
    const errorModalMessage = translations.search.dataFetchErrorMessage // connection error message stored in json
    const [imageToDisplay, setImageToDisplay] = useState(dbResponse.image ? Array.isArray(JSON.parse(dbResponse.image)) ?
    JSON.parse(dbResponse.image)[0] : JSON.parse(dbResponse.image) : null)

    return (
        <>
            <Head>
                <title>{translations.homepage.metadata.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:site_name" content="Hommatori.fi" />
                <meta property="og:title" content={dbResponse.header} />
                <meta property="og:description" content={dbResponse.region + ' ' + dbResponse.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="http://www.hommatori.fi" />
                <meta name="keywords" content={dbResponse.description} />
                <meta name="description" content={dbResponse.description} />
                <link rel="canonical" href="http://www.hommatori.fi/" />
                <link rel="shortcut icon" href="hommatori_favicon.ico" />
                <link rel="icon" href="hommatori_favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.adBanner}></div>
                <div className={styles.pageLocationNavigation}>
                    <Link className={styles.pageLocationLink} href="/">etusivu </Link>
                    <Link className={styles.pageLocationLink} href="">{dbResponse.region} </Link>
                    <Link className={styles.pageLocationLink} href="">{dbResponse.type} </Link>
                    {dbResponse.header.substring(0, 30)}{dbResponse.header.length < 30 ? '' : '..'}
                </div>
                <h1 className={styles.header}>{dbResponse.header}</h1>
                <div className={styles.adWrapper}>
                    { dbResponse.image ?
                        <div className={styles.imagesWrapper}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={imageToDisplay}
                                    fill
                                    style={{ objectFit: 'contain' }}                        
                                />
                            </div> {
                                Array.isArray(JSON.parse(dbResponse.image)) ?
                                <div className={styles.imageSelector}> {
                                    JSON.parse(dbResponse.image).map((itm, index) => {
                                        return <Image
                                        key={index}
                                        className={itm == imageToDisplay ? styles.selectorImageSelected : styles.selectorImage}
                                        src={itm}
                                        height={45}
                                        width={45}
                                        onClick={() => setImageToDisplay(itm)}
                                    />
                                    })
                                } </div>
                                : <></>
                        } </div> 
                        : <></>
                    }
                    <p className={styles.description}>{dbResponse.description}</p>
                </div>              
            </main>
            { /* informative modal will be shown if data fetch from server fails */
                fetchError ? <Modal message={errorModalMessage} closeModal={() => setFetchError(false)} /> : <></> 
            }
        </>
    )
}