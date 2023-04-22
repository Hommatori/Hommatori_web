import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from '../../../components/modal.js'
import styles from '../../../styles/ad.module.css'
import Link from 'next/link'

export async function getServerSideProps(context) {
    var address = process.env.ADDRESS || 'http://localhost:8080';
    let errorMsg = false
    const adid = context.query.adid
    let dbResponse = {}
    let dbPublisher = {}

    try {            
        const dbQuery = await fetch(`${address}/ad/${adid}`)
        dbResponse = await dbQuery.json()
        try {
            const dbQueryPublisher = await fetch(`${address}/userr/ad/${dbResponse.userid}`);           
            dbPublisher = await dbQueryPublisher.json();
        } catch(e) {
            errorMsg = true
        }        
    } catch(e) {
        errorMsg = true
    }

    if(Object.keys(dbResponse).length === 0 || dbResponse.status == 500 || dbResponse.adid == undefined) {
        return {
            redirect: {
                destination: '/notfound',
                permanent: false,
            }
        }
    }
    return {
        props: {
            dbResponse,
            dbPublisher,
            errorMsg
        }
    };   
}

// this is a single ad page
export default function Ad({ translations, dbResponse, dbPublisher, errorMsg }) {
    const [fetchError, setFetchError] = useState(errorMsg) // boolean value for wether to show error message or not
    const errorModalMessage = translations.search.dataFetchErrorMessage // connection error message stored in json
    const [imageIsArray, setImageIsArray] = useState(false)
    const [imageToDisplay, setImageToDisplay] = useState(function() {
        let imageToDisplay = null
        if (dbResponse.image) {
            try {
                const imageArray = JSON.parse(dbResponse.image)
                if (Array.isArray(imageArray)) {               
                    imageToDisplay = imageArray[0]
                    setImageIsArray(true)
                }
            } catch {
                imageToDisplay = dbResponse.image.replace(/['"\r\n]+/g, '')
            }
        }
        return imageToDisplay
    })
    const [selectableImageWidth, setSelectableImageWidth] = useState(70) // set initial width to 500
    const [selectableImageHeight, setSelectableImageHeight] = useState(55) // set initial height to 500

    useEffect(() => { // handle selectableImage static width and height change
        const handleResize = () => {
            const screenWidth = window.innerWidth
            let newWidth = 70 // set default width
            let newHeight = 55 // set default height 

            if (screenWidth <= 600) {
                newWidth = 60 // set new width for small screens
                newHeight = 50 // set new height for small screens
            }    
            setSelectableImageWidth(newWidth)
            setSelectableImageHeight(newHeight)
        }  
          
        handleResize()    
        window.addEventListener('resize', handleResize)    
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])

    return (
        <>  { Object.keys(dbResponse).length !== 0 ? <>
            <Head>
                <title>{translations.homepage.metadata.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:site_name" content="Hommatori.fi" />
                <meta property="og:title" content={dbResponse.header} />
                <meta property="og:description" content={dbResponse.region+' '+dbResponse.municipality+' '+dbResponse.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="http://www.hommatori.fi" />
                <meta name="keywords" content={dbResponse.region+' '+dbResponse.municipality+' '+dbResponse.description} />
                <meta name="description" content={dbResponse.region+' '+dbResponse.municipality+' '+dbResponse.description} />
                <link rel="canonical" href="http://www.hommatori.fi/" />
                <link rel="shortcut icon" href="hommatori_favicon.ico" />
                <link rel="icon" href="hommatori_favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.adBanner}></div>
                <div className={styles.breadcrumbs}>
                    <Link className={styles.breadcrumbLink1} href="/">{translations.ad.mainpage}</Link>
                    <span className={styles.divider}> /</span>
                    <Link className={styles.breadcrumbLink2} href={`/search?reg=${dbResponse.region}`}>{dbResponse.region}</Link>
                    <span className={styles.divider}> /</span>
                    <Link className={styles.breadcrumbLink3} href={`/search?type=${dbResponse.type}&reg=${dbResponse.region}`}>
                        {dbResponse.type == 'joboffer' ? translations.ad.joboffers : dbResponse.type == 'jobseeker' ? translations.ad.jobseekers : ''}
                    </Link>
                    <span className={styles.divider}> /</span>
                    <div className={styles.breadcrumbItem}>{dbResponse.header.substring(0, 30)} {dbResponse.header.length < 30 ? '' : '..'}</div>
                </div>
                <h1 className={styles.header}>{dbResponse.header}</h1>
                <div className={styles.adWrapper}>
                    <div className={styles.adWrapperLeft}>
                        { dbResponse.image ?
                            <div className={styles.imagesWrapper}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={imageToDisplay}
                                        fill
                                        style={{ objectFit: 'contain' }}                        
                                    />
                                </div> {
                                    imageIsArray ?
                                    <div className={styles.imageSelector}>                                    
                                        {
                                            JSON.parse(dbResponse.image).map((itm, index) => {
                                                return <Image
                                                    key={index}
                                                    className={itm == imageToDisplay ? styles.selectableImageSelected : styles.selectableImage}
                                                    src={itm}
                                                    height={selectableImageHeight}
                                                    width={selectableImageWidth}
                                                    style={{ objectFit: 'cover' }} 
                                                    onClick={() => setImageToDisplay(itm)}
                                                />
                                            })                                        
                                        }                                    
                                    </div>
                                    : <></>
                            } </div> 
                            : <></>
                        }
                        <div>
                            <p className={styles.locationTag}>{dbResponse.location ? dbResponse.location : null} {dbResponse.municipality}, {dbResponse.region}</p>
                            <b className={styles.descriptionHeader}>{translations.ad.description}</b>
                            <p className={styles.description}>{dbResponse.description}</p>
                        </div>
                    </div>
                    <div className={styles.adWrapperRight}>
                        <div className={styles.adWrapperRightTop}>
                            <p>{translations.ad.publisher}</p>
                        </div>
                        <div className={styles.adWrapperRightBottom}>
                            <b>{dbPublisher.username}</b><br/><br/>
                            <p>{dbResponse.location ? dbResponse.location +  ', ' : null}{dbResponse.municipality}</p>
                            <p>{dbResponse.region}</p><br/>
                            <div className={styles.sendMessageBtn}>{translations.ad.send_message}</div>
                        </div>
                    </div>
                </div>              
            </main>
            { /* informative modal will be shown if data fetch from server fails */
                fetchError ? <Modal message={errorModalMessage} closeModal={() => setFetchError(false)} /> : <></> 
            }
            </> : <></>

        }
        </>
    )
}