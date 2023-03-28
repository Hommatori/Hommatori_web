import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import styles from './global_styles.css'
import translations from './../translations.json'
import Header from './../components/header'
import Footer from './../components/footer'

/*
What is the _app.js file? It overrides the global App component and gives access to global features.

The Component prop is the page view that will be rendered
The pageProps prop is received by each page that is rendered
*/
export default function App({ Component, pageProps }) {

  const [language, setLanguage] = useState(translations.fi)

  function switchLanguage(lang) {
    if(lang == "en" ) {
      setLanguage(translations.en)
    } else if(lang == "fi" ) {
      setLanguage(translations.fi)
    }
  }

  const router = useRouter()
  useEffect(() => {
    console.log(router.pathname)
  }, [])

  return(    
    <div className={styles._app}>
      { router.pathname !== '/tili' && <Header translations={ language.header } switchLanguage={ switchLanguage } /> }
        <Component {...pageProps} translations={language} />
      { router.pathname !== '/tili' && <Footer translations={ language.footer } /> }
    </div>
  )
}
