import Head from 'next/head'
import styles from './index.module.css'
import background_img from '../../public/homepage_background.jpg'
import Link from 'next/link'
import regions from '../json/regions'
import Image from 'next/image'

export default function Home({ translations }) {

    function Submit() {
        console.log("hello")
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
                <Image
                className={styles.background_img}
                    src={background_img}
                    alt=""
                    priority={true}
                />
                <div className={styles.searchbox_container}>
                    <h2>{translations.homepage.work_awaits}</h2>
                    <h3>{translations.homepage.work_awaits_description}</h3>
                    <div className={styles.searchbox_form}>
                        <div className={styles.searchbox_input}>
                            <input className={styles.searchbox_input_field} type="text" placeholder={translations.homepage.work_awaits_searchbox} />
                            <p onClick={() => Submit()} className={styles.searchbox_input_submit_btn}>{translations.homepage.get_started}</p>
                        </div>
                        <div className={styles.selections_container}>
                            <select className={styles.region_select}>
                                <option value={"all"}>{translations.homepage.region_entire_finland}</option>
                                {
                                    Object.keys(regions).map((item, index) => {
                                        return <option key={index} value={item}>{item}</option>
                                    })  
                                }
                            </select>
                            <select className={styles.ad_type_select}>
                                <option value={"all"}>{translations.homepage.ad_type_all}</option>
                                <option value={"jobseekers"}>{translations.homepage.ad_type_seekers}</option>
                                <option value={"joboffers"}>{translations.homepage.ad_type_offers}</option>
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

            </main>
        </>
    )
}