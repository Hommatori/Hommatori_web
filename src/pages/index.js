import Head from 'next/head'
import styles from './index.module.css'

export default function Home({ translations }) {

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="Hommatori.fi" />
        <meta property="og:title" content="Hommatori.fi - Osta ja myy helposti. Ilmoita ilmaiseksi Torissa." />
        <meta property="og:description" content="Hommatori.fi on ilmainen pienten hanttihommien ja avuntarpeiden jakoalusta, jossa avun tarjoaja ja tekijä kohtaavat."></meta>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://www.hommatori.fi" />
        <meta name="keywords" content="työ, töitä, apu, auta, palkka, raha, palvelu, hyväntekeväisyys" />
        <meta name="description" content="Hommatori.fi on ilmainen pienten hanttihommien ja avuntarpeiden jakoalusta, jossa avun tarjoaja ja tekijä kohtaavat." />
        <link rel="canonical" href="http://www.hommatori.fi/" />
        <link rel="shortcut icon" href="hommatori_favicon.ico" />
        <link rel="icon" href="hommatori_favicon.ico" />
      </Head>
      <main className={styles.index}>
        <div className={styles.searchbox_container}>
          <h2>{translations.homepage.work_awaits}</h2>
          <h3>{translations.homepage.work_awaits_description}</h3>
          <div className={styles.searchbox_input}>
            <input className={styles.searchbox_input_field} type="text" placeholder={translations.homepage.work_awaits_searchbox} />
            <p className={styles.searchbox_input_submit_btn}>{translations.homepage.work_awaits_searchbox_get_started}</p>
          </div>
          <div className={styles.searchbox_options}>

          </div>
        </div>
      </main>
    </>
  )
}
