import Head from 'next/head'
import styles from '../styles/account.module.css'
import cookie from 'cookie'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const getServerSideProps = async ({ req, res }) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const accessToken = cookies['accessToken'];
  const userCookie = cookies['userData'];
  let userData = null;

  console.log('accessToken:', accessToken);
  console.log('userCookie:', userCookie);

  if (!accessToken || !userCookie) {
    console.log('Redirecting to /login (missing cookies)');
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const cookieHeader = 'accessToken=' + accessToken;
  const decodedUser = JSON.parse(decodeURIComponent(userCookie));
  try {
    const response = await fetch('http://localhost:8080/userr/getprivatedata/' + decodedUser.id, {
      headers: {
        Cookie: cookieHeader,
        credentials: 'include'
      },
    });

    console.log('Private data response:', response);

    if (!response.ok) {
      console.log('Redirecting to /login (response not ok)');
      res.setHeader('location', '/login');
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }
    userData = await response.json();
  } catch (err) {
    console.error('Error fetching private data:', err);
  }

  return {
    props: { userData },
  };
};

export default function Account({ translations, userData }) {
    const router = useRouter()

    useEffect(() => {
         // Automatically scrolls to the top of the page, useful for mobile users
    window.scrollTo(0, 0)
      }, [])   

    function logout() {
        fetch('/api/logout', {
            method: 'POST',
        })
        .then( function(){
            router.push('/')
        })
    }

    console.log(userData)

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
                { userData ?
                <>
                    <h1>Welcome, {userData.userid}!</h1>
                    <p>Your email address is: {userData.email}</p>
                    <button onClick={() => logout()}>log out</button>
                </>
                :
                <div onLoad={window.location.reload()}>redirecting...</div>
                }
            </main>
        </>
    )
}