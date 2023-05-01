import Head from 'next/head'
import styles from './../styles/error.module.css'
import Link from 'next/link'

export default function Error({ translations }) {

    return (
        <>
            <Head>
                <title>{translations.error.metadata.title}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta property='og:site_name' content='Hommatori.fi' />
                <meta property='og:title' content={translations.error.metadata.title} />
                <meta property='og:description' content={translations.error.metadata.title} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='http://www.hommatori.fi' />
                <meta name='description' content={translations.error.metadata.title} />
                <link rel='shortcut icon' href='hommatori_favicon.ico' />
                <link rel='icon' href='hommatori_favicon.ico' />
            </Head>

            <main className={styles.main}>
                <div className={styles.not_found_message}>
                    <b className={styles.not_found_message_header}>{translations.error.header}</b>
                    <p className={styles.not_found_message_text}>{translations.error.continue}
                        <Link href='/' className={styles.not_found_message_link}> {translations.error.here}</Link>
                    </p>
                </div>
            </main>
        </>
    )
}