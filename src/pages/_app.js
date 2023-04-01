import styles from '../styles/global_styles.css'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import translations from '../json/translations'

// the _app.js file is not a page itself, but the root of all components which can serve props to the current page (any page will include this component)
export default function App({ Component, pageProps, router }) {
  const { locale } = router // gets the current locale (read: page language, can either be "fi" or "en") so it can be used to change page language translations

  return(    
    <div className={styles._app}> 
      { router.pathname != '/account' && <Navbar locale={locale} translations={translations[locale].navbar} /> }
      <Component {...pageProps } translations={translations[locale]} />
      { router.pathname != '/account' && <Footer translations={translations[locale].footer} /> }      
    </div>
  )
}