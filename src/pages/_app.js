import styles from '../styles/global_styles.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import translations from '../json/translations'

export default function App({ Component, pageProps, router }) {
  const { locale } = router

  return(    
    <div className={styles._app}>
      { router.pathname != '/account' && <Navbar locale={locale} translations={translations[locale].navbar} /> }
      <Component {...pageProps } translations={translations[locale]} />
      { router.pathname != '/account' && <Footer translations={translations[locale].footer} /> }      
    </div>
  )
}