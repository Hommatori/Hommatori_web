import Head from 'next/head'
import styles from '../styles/account.module.css'
import cookie from 'cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from '@/components/loader'

export const getServerSideProps = async ({ req, res }) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const accessToken = cookies['accessToken']
  const userCookie = cookies['userData']
  let userData = null
  let serverError = null

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
      console.log(process.env.NEXTJS_URL)
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

  console.log(userData)

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

  //.log(userData)

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

      <main> {
        userData ?
        <><div>account</div>
          
          <h1>Welcome, {userData.userid}!</h1>
          <p>Your email address is: {userData.email}</p>
          <button onClick={() => logout()}>log out</button>
        </> : <div onLoad={router.push('/')} />
      } </main>
    </>
  )
}