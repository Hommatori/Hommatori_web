import Head from 'next/head'
import styles from '../styles/account.module.css'
import cookie from 'cookie';

export const getServerSideProps = async ({ req, res }) => {
    const cookies = cookie.parse(req.headers.cookie || '');
    const userCookie = cookies['user'];
    const sessionCookie = cookies['session'];
    let data = null

    if (!userCookie) {
        res.setHeader("location", "/login");
        res.statusCode = 401;
        res.end();
        return { props: {} };
    }
    
    const cookieHeader = `user=${userCookie}; session=${sessionCookie}`;
    const decodedUser = JSON.parse(decodeURIComponent(userCookie));
    try {
        const response = await fetch(`http://localhost:8080/userr/getprivatedata/${decodedUser.id}`, {
            headers: {
            Cookie: cookieHeader,
            },
        });

        if (!response.ok) {
            res.setHeader('location', '/login');
            res.statusCode = 302;
            res.end();
            return { props: {} };
        }
        data = await response.json();

        
    } catch (err) {

    }

    return {
        props: { data },
    };
};

export default function Account({ translations, data }) {

    console.log(data)

    return (
        <>
            <Head>
                <title>{translations.homepage.metadata.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:site_name" content="Hommatori.fi" />
                <meta property="og:title" content={""} />
                <meta property="og:description" content={""} />
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
                <h1>Welcome, {data.userid}!</h1>
                <p>Your email address is: {data.email}</p>
            </main>
        </>
    )
}