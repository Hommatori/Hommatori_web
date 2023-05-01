import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/login.module.css'
import Image from 'next/image'
import logo from '../../public/logo.svg'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Loader from '@/components/loader'

export async function getServerSideProps(context) {
  const source = context.query.source ? context.query.source : '/account'
  return { props: { source } }
}

export default function Login({ locale, translations, source }) {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState(translations.login.wrong_credentials)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-cookie-status')
        const data = await res.json()

        if (data.authenticated) {
          router.push('/account')
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

  function login(event) {
    event.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const token = Buffer.from(`${email}:${password}`).toString('base64')
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
      },
      credentials: 'include',
    })
    .then((res) => {
      if (res.status == 200) {
        source == '/form' ? router.push('/form') : router.push(source)
      } else if (res.status == 401){
        setErrorMessage(translations.login.wrong_credentials)
        let errorMsg = document.getElementById('loginErrorMsg')
        errorMsg.style.visibility = 'visible'
        setTimeout(function() {
          errorMsg.style.visibility = 'hidden'
        }, 5000)
      } else {
        setErrorMessage(translations.login.server_error)
        let errorMsg = document.getElementById('loginErrorMsg')
        errorMsg.style.visibility = 'visible'
        setTimeout(function() {
          errorMsg.style.visibility = 'hidden'
        }, 5000)
      }
    })
  }

  return (
    <main className={styles.main}>
      <div className={styles.loginContent}>
      <div className={styles.language_selector}>
        {
          locale == 'fi' ?  <Link className={styles.lang_selector_link} href={router.asPath} locale='en' title={translations.login.language_selector}>EN</Link>
          :
          <Link className={styles.lang_selector_link} href={router.asPath} locale='fi' title={translations.login.language_selector}>FI</Link>
        }
      </div>
      <Link className={styles.logoContainer} href='/'>
        <Image
          className={styles.logo}
          src={logo}
          alt='HOMMATORI'
          as='image'
          fill
          style={{ objectFit: 'contain' }} />
        </Link>
        <div className={styles.loginTitle}>{translations.login.login_title}</div>
        <div className={styles.loginSubTitle}>{translations.login.login_description}</div>
        <div className={styles.loginErrorMessage} id='loginErrorMsg'>{errorMessage}</div>
        <form className={styles.loginForm} onSubmit={(event) => login(event)} method='POST'>
          <input
            type='email'
            id='email'
            className={styles.loginEmail}
            name='email'
            placeholder={translations.login.email}
            autoComplete='off'
            //required pattern='[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            title={translations.login.email_hint}
          />
          <input
            type='password'
            id='password'
            className={styles.loginPassword}
            name='password'
            placeholder={translations.login.password}
            autoComplete='off'
            required
          />
          <input
            type='submit'
            className={styles.loginSubmit}
            value='Log in'
          />
          <div className={styles.loginMiddleText}>{translations.login.no_account}</div>
          <Link className={styles.loginBtnRegister} href='/signup'>{translations.login.register}</Link>
        </form>  
      </div>
    </main>        
  )
}