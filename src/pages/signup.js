import Head from 'next/head'
import styles from '../styles/account.module.css'
import cookie from 'cookie'

export const getServerSideProps = async ({ req, res }) => {
    // Get all cookies associated with the request
    const cookies = req.headers.cookie
    // Check if the 'user' cookie exists
    const userCookieExists = cookies && cookies.includes('user=')
    // Check if the 'session' cookie exists
    const sessionCookieExists = cookies && cookies.includes('session=')

    if (!userCookieExists && !sessionCookieExists) {
        res.setHeader('location', '/')
        res.statusCode = 302
        res.end()
        return { props: {} }
    }

    return {
        props: {},
    }
}

export default function Signup({ translations, data }) {

    console.log(data)

    return (
        <>
            <Head>
                <title>{translations.homepage.metadata.title}</title>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta property='og:site_name' content='Hommatori.fi' />
                <meta property='og:title' content={''} />
                <meta property='og:description' content={''} />
                <meta property='og:type' content='website' />
                <meta property='og:url' content='http://www.hommatori.fi' />
                <meta name='keywords' content={''} />
                <meta name='description' content={''} />
                <link rel='canonical' href='http://www.hommatori.fi/' />
                <link rel='shortcut icon' href='hommatori_favicon.ico' />
                <link rel='icon' href='hommatori_favicon.ico' />
            </Head>

            <main>
                <br/><br/><br/><br/><br/><br/><br/>
                <div>sign up</div>
            </main>
        </>
    )
}