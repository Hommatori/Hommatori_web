import Head from 'next/head'
import styles from '../styles/index.module.css'
import background_img from '../../public/homepage_background.jpg'
import Link from 'next/link'
import regions from '../json/regions'
import Image from 'next/image'
import { useRouter } from 'next/router'

// this is the root/main page */* that user enters. It receives page language translations as props
export default function Home({ translations }) {
    const router = useRouter()

    // Submit() collects search parameters and enters the search page with URL query params
    function Submit() {
        let input = document.getElementById('input').value
        let region = document.getElementById('region_select').value.toLowerCase()
        let ad_type = document.getElementById('ad_type_select').value
        router.push('/search?q='+ input +'&reg='+ region + '&type=' + ad_type)
    }

    return (
        <>
            <Head>
            <title>{translations.homepage.metadata.title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="og:site_name" content="Hommatori.fi" />
            <meta property="og:title" content={translations.homepage.metadata.title} />
            <meta property="og:description" content={translations.homepage.metadata.description}></meta>
            <meta property="og:type" content="website" />
            <meta property="og:url" content="http://www.hommatori.fi" />
            <meta name="keywords" content={translations.homepage.metadata.keywords} />
            <meta name="description" content={translations.homepage.metadata.description} />
            <link rel="canonical" href="http://www.hommatori.fi/" />
            <link rel="shortcut icon" href="hommatori_favicon.ico" />
            <link rel="icon" href="hommatori_favicon.ico" />
            </Head>

            <main className={styles.index}>
                <div className={styles.background_img_wrapper}>
                    <Image
                        className={styles.background_img}
                        src={background_img}
                        alt=""
                        priority={true}
                    />
                </div>

                <div className={styles.searchbox_container}>
                    <div className={styles.searchbox_inner_container}>
                        <h2>{translations.homepage.work_awaits}</h2>
                        <h3>{translations.homepage.work_awaits_description}</h3>
                        <div className={styles.searchbox_form}>
                            <div className={styles.searchbox_input}>
                                <input className={styles.searchbox_input_field} id='input' type="text" placeholder={translations.homepage.work_awaits_searchbox} autoComplete="off"/>
                                <p onClick={() => Submit()} className={styles.searchbox_input_submit_btn}>{translations.homepage.get_started}</p>
                            </div>
                            <div className={styles.selections_container}>
                                <select className={styles.region_select} id='region_select'>
                                    <option value={"all"}>{translations.homepage.region_entire_finland}</option>
                                    {
                                        Object.keys(regions).map((item, index) => {
                                            return <option key={index} value={item}>{item}</option>
                                        })  
                                    }
                                </select>
                                <select className={styles.ad_type_select} id='ad_type_select'>
                                    <option value={"all"}>{translations.homepage.ad_type_all}</option>
                                    <option value={"seekers"}>{translations.homepage.ad_type_seekers}</option>
                                    <option value={"offers"}>{translations.homepage.ad_type_offers}</option>
                                </select>
                            </div>                       
                        </div>                    
                    </div>

                    <div className={styles.publish_ad_container}>
                        <p className={styles.publish_ad_title}>{translations.homepage.searchbox_publish}</p>
                        <div className={styles.publish_ad_options}>
                            <div className={styles.publish_ad_option}>
                                <p>{translations.homepage.publish_as_jobseeker}</p>
                            </div>
                            <div className={styles.publish_ad_option}>
                                <p>{translations.homepage.publish_as_employer}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.content_container}>
                    * insert some content here *
                </div>

            </main>
        </>
    )
}