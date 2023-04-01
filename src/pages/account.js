import Head from 'next/head'
import styles from '../styles/account.module.css'

export default function Account({ translations }) {

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
                <div>account</div>
            </main>
        </>
    )
}