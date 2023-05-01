import Head from 'next/head'
import styles from '../../styles/account.module.css'
import cookie from 'cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from '@/components/loader'
import Link from 'next/link'

export async function getServerSideProps(context) {
  const { req, res } = context
  const cookies = cookie.parse(req.headers.cookie || '')
  const accessToken = cookies['accessToken']
  const userCookie = cookies['userData']
  let userData = null
  let serverError = null
  const pageToShow = context.query.page
  if (pageToShow != 'myads' && pageToShow != 'profile') {
    res.setHeader('location', '/account/profile')
    res.statusCode = 302
    res.end()
    return { props: {} }
  }

  if (!accessToken || !userCookie) {
    res.setHeader('location', '/login')
    res.statusCode = 302
    res.end()
    return { props: {} }
  }

  const cookieHeader = `accessToken=${accessToken}`
  const decodedUser = JSON.parse(decodeURIComponent(userCookie))
  try {
    const response = await fetch(`${process.env.NODEJS_URL}/userr/getprivatedata/${decodedUser.id}`, {
      headers: {
        Cookie: cookieHeader,
        credentials: 'include'
      },
    })

    if (!response.ok) {
      fetch(`${process.env.NEXTJS_URL}/api/logout`, {
        method: 'POST',
      }).then(res => console.log(res.status))
      res.setHeader('location', '/login')
      res.statusCode = 302
      res.end()
      return { props: {} }
    }
    userData = await response.json()
    
  } catch (err) {
    // Server down or other server error
    serverError = 'An unexpected server error occurrred - please try again later'
  }

  return {
    props: { userData, serverError },
  }
}

export default function Account({ translations, userData, serverError }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)  

  useEffect(() => {
    window.scrollTo(0, 0)
  
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-cookie-status')
        const data = await res.json()

        if (serverError) {
          setTimeout(() => {
            alert(serverError)
          }, 500)       
        } else if (!data.authenticated || !userData) {
          router.push('/login')
        } else {
          setIsLoading(false)
        }
      } catch (error) {}
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return <Loader />
  }  

  async function logout() {
    try {
      const res = await fetch('/api/logout')
      if (res.ok) {
        router.push('/')
      } else {
        alert('Failed to log out!');
      }
    } catch (error) {}
  }

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

      <main className={styles.main}> {
        userData ?
        <><div className={styles.account_navbar}>
          <Link href='/account/profile'>{translations.account.profile}</Link>
          <Link href='/account/myads'>{translations.account.myads}</Link>
          <button onClick={() => logout()}>{translations.account.logout}</button>
        </div>
          
          <h1>Welcome, {userData.userid}!</h1>
          <p>Your email address is: {userData.email}</p>
          

        </> : <div onLoad={router.push('/')} />
      } </main>
    </>
  )
}