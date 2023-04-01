import Head from 'next/head'
import styles from '../styles/search.module.css'

// by exporting getStaticProps, Next.js will pre-render this page (Search) at build time using the props returned by getStaticProps
export async function getStaticProps() {
        
    return {
        props: {}, // will be passed to the Search component as props
    }
}

// this is the search results page that user sees after performing a search. It receives page language translations as props
export default function Search({ translations }) {
    

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