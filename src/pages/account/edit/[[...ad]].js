import Head from 'next/head'
import styles from '../../../styles/account.module.css'
import cookie from 'cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loader from '@/components/loader'
import Link from 'next/link'
import Modal from '@/components/modal'
import Image from 'next/image'

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
  if (pageToShow != 'myads'){
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
  } else {
    try {
      const response = await fetch(`${process.env.NODEJS_URL}/ad/withuserid/get?userid=${decodedUser.id}`, {
        headers: {
          Cookie: cookieHeader,
          credentials: 'include'
        },
      })
      
      if (!response.ok) {
        /*fetch(`${process.env.NEXTJS_URL}/api/logout`, {
          method: 'POST',
        }).then(res => console.log(res.status))
        res.setHeader('location', '/login')
        res.statusCode = 302
        res.end()
        return { props: {} }*/
      }
      userData = await response.json()
      
    } catch (err) {
      // Server down or other server error
      serverError = 'An unexpected server error occurrred - please try again later'
    }
  }

  return {
    props: { userData, serverError, pageToShow },
  }
}

export default function Account({ translations, userData, serverError, pageToShow }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showError, setShowError] = useState(false)
  const [errorModalText, setErrorModalText] = useState(false)


  useEffect(() => {
    window.scrollTo(0, 0)
  
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-cookie-status')
        const data = await res.json()

        if (serverError) {
          setErrorModalText('Oops, could not connect to the server')
          setShowError(true)
        } else if (!data.authenticated || !userData) {
          router.push('/login')
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        setErrorModalText('Oops, could not connect to the server')
        setShowError(true)
      }
    }
    checkAuth()
  }, [])

  async function logout() {
    try {
      const res = await fetch('/api/logout')
      if (res.ok) {
        router.push('/')
      } else {
        alert('Failed to log out!');
      }
    } catch (error) {
      setErrorModalText('Oops, could not connect to the server')
      setShowError(true)
    }
  }

  function getSingleImage(image) {
    let imageToDisplay = null
    if (image) {
        try {
            const imageArray = JSON.parse(image)
            if (Array.isArray(imageArray)) {
                imageToDisplay = imageArray[0]          
            }
        } catch {
            imageToDisplay = image.replace(/['"\r\n]+/g, '')
        }
    }
    return imageToDisplay
  }

  function getDate(item_date){
    // create a new Date object with the given date string
    const date = new Date(item_date)

    // create an array of month names
    const monthNames = translations.search.list_of_months

    // get the day and month from the date object
    const day = date.getUTCDate();
    const month = monthNames[date.getUTCMonth()]

    // get the hours and minutes from the date object
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()

    // create the formatted date string
    const formattedDate = (day === new Date().getUTCDate() && date.getUTCMonth() === new Date().getUTCMonth()) ? 'today' : `${day} ${month}`
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    return `${formattedDate} ${formattedTime}`
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

      <main className={styles.main}>
        {isLoading ? <Loader /> : null}
        {!isLoading && userData ? (
          <>
            <div className={styles.account_navbar}>
              <div className={styles.navbar_right}>
                <Link
                  className={`${pageToShow == 'profile' ? styles.navBtn_active : styles.navBtn_inactive} ${styles.btnleft}`}
                  href='/account/profile'
                >
                  {translations.account.profile}
                </Link>
                <Link
                  className={pageToShow == 'myads' ? styles.navBtn_active : styles.navBtn_inactive}
                  href='/account/myads'
                >
                  {translations.account.myads}
                </Link>
              </div>
              <p className={styles.logoutBtn} onClick={() => logout()}>
                {translations.account.logout}
              </p>
            </div>

            { pageToShow != 'myads' ? (
              <div className={styles.accountDataWrapper}>
                <div className={styles.mydetails_wrapper}>
                  <h3 className={styles.header}>omat tiedot</h3>
                  <div className={styles.mydetails_row}>
                  <p className={styles.mydetails_title}>{translations.account.fname}:</p>
                  <p className={styles.mydetails_value}>{userData.fname}</p>
                </div>
                <div className={styles.mydetails_row}>
                  <p className={styles.mydetails_title}>{translations.account.lname}:</p>
                  <p className={styles.mydetails_value}>{userData.lname}</p>
                </div>
                <div className={styles.mydetails_row}>
                  <p className={styles.mydetails_title}>{translations.account.username}:</p>
                  <p className={styles.mydetails_value}>{userData.username}</p>
                </div>
                <div className={styles.mydetails_row}>
                  <p className={styles.mydetails_title}>{translations.account.email}:</p>
                  <p className={styles.mydetails_value}>{userData.email}</p>
                </div>
                <div className={styles.mydetails_row}>
                  <p className={styles.mydetails_title}>{translations.account.phone}:</p>
                  <p className={styles.mydetails_value}>{userData.phonenumber}</p>
                </div>
                  <div className={styles.created_at}>{translations.account.creation_date}: {getDate(userData.creation_time)}</div>
                </div>

                <div className={styles.mydetails_wrapper}>
                  <h3 className={styles.header}>omat tiedot</h3>
                  <div className={styles.mydetails_row}>
                    <p className={styles.mydetails_title}>mydetails</p>
                    <p className={styles.mydetails_value}>mydetails</p>
                  </div>
                </div>
              </div>
            ) : (
              !userData.length ? <p>{translations.account.no_ads}</p> :
              <><p>{translations.account.you_have} {userData.length} {translations.account.ads}</p>
              { userData.length && userData.map((item, index) => {
            return <Link
                        className={index == 0 ? styles.firstSingleAd : styles.singleAd}
                        key={item.adid}
                        href={`/ad/${item.adid}/${item.header}`}>
                {
                    item.image != null && JSON.parse(item.image).length != 0 ?
                    <div className={styles.singleAdImageWrapper}>
                        <Image
                            src={getSingleImage(item.image)}
                            alt='hommatori'
                            as='image'
                            fill
                            style={{ objectFit: 'fill' }}  
                        /> 
                    </div> : <></>
                }
                
                <div className={styles.singleAdData}>
                    <div className={styles.singleAdDataTop}>
                        <h3 className={styles.header}>{item.header}</h3>                        
                        <p className={styles.description}>{item.description}</p>
                    </div>
                    <div className={styles.singleAdDataBottom}>
                        <div className={styles.price}>{item.price} €</div>
                        {item.region}, {item.municipality} { getDate(item.date) }
                    </div>
                </div>
            </Link>
        })}</>
            )}
          </>
        ) : (
          <Loader />
        )}
      </main>

      { /* informative modal will be shown if data fetch from server fails */
        showError || serverError ? <Modal message={errorModalText} closeModal={() => setShowError(false)} /> : <></> 
      }
    </>
  )
}