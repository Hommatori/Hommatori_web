import Head from 'next/head'
import styles from '../styles/search.module.css'
import { useSearchParams } from 'next/navigation'

// this is the search results page that user sees after performing a search. It receives page language translations as props
export default function Search({ translations }) {
    
    const searchParams = useSearchParams() // gets a read-only URLSearchParams object
    const query = searchParams.get('q') // get query param
    const region = searchParams.get('reg') // get region param
    const type = searchParams.get('type') // get ad type param
    console.log(query + " " + region + " " + type)

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

            <main>
                <div>search</div>
            </main>
        </>
    )
}