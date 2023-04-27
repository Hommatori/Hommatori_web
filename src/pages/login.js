import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/login.module.css'
import cookie from 'cookie'
import Image from 'next/image'
import logo from '../../public/logo.svg'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export const getServerSideProps = async ({ req, res }) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const accessToken = cookies['accessToken']
  const userCookie = cookies['userData']
  let shouldRender = false
  if (accessToken || userCookie) {
    res.setHeader('location', '/account')
    res.statusCode = 302
    res.end()
    shouldRender = true
    return { props: {} }
  }

  return {
    props: {
      shouldRender
    }
  }
}

export default function Login({ translations, shouldRender }) {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState(translations.login.wrong_credentials)

  useEffect(() => {
    const requiredCookies = ['accessToken', 'userData']
    const cookies = document.cookie.split('; ').reduce((acc, c) => {
      const [key, value] = c.split('=')
      acc[key] = value
      return acc
    }, {})
    const hasCookies = requiredCookies.every((cookieName) =>
      cookies.hasOwnProperty(cookieName)
    )
    if (hasCookies) {
      router.push('/account')
      return
    }
  }, [])

  function login(event) {
    event.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
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
        router.push('/account')
      } else if (res.status == 401){
        setErrorMessage(translations.login.wrong_credentials)
        let errorMsg = document.getElementById("loginErrorMsg")
        errorMsg.style.visibility = 'visible'
        setTimeout(function() {
          errorMsg.style.visibility = 'hidden'
        }, 5000)
      } else {
        setErrorMessage(translations.login.server_error)
        let errorMsg = document.getElementById("loginErrorMsg")
        errorMsg.style.visibility = 'visible'
        setTimeout(function() {
          errorMsg.style.visibility = 'hidden'
        }, 5000)
      }
    })
  }

  function logout() {
    fetch('/api/logout', {
        method: 'POST',
    })
  }
  

  return (
    <main className={styles.main}>
      { !shouldRender ?
      <div className={styles.loginContent}>
      <Link className={styles.logoContainer} href='/'>
        <Image
            className={styles.logo}
            src={logo}
            alt="HOMMATORI"
            as="image"
            fill
            style={{ objectFit: 'contain' }}  
          />
        </Link>
        <div className={styles.loginTitle}>{translations.login.login_title}</div>
        <div className={styles.loginSubTitle}>{translations.login.login_description}</div>
        <div className={styles.loginErrorMessage} id="loginErrorMsg">{errorMessage}</div>
        <form className={styles.loginForm} onSubmit={(event) => login(event)} method="POST">
          <input
            type="email"
            id="email"
            className={styles.loginEmail}
            name="email"
            placeholder={translations.login.email}
            autoComplete="off"
            //required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title={translations.login.email_hint}
          />
          <input
            type="password"
            id="password"
            className={styles.loginPassword}
            name="password"
            placeholder={translations.login.password}
            autoComplete="off"
            required
          />
          <input
            type="submit"
            className={styles.loginSubmit}
            value="Log in"
          />
          <div className={styles.loginMiddleText}>{translations.login.no_account}</div>
          <Link className={styles.loginBtnRegister} href='/signup'>{translations.login.register}</Link>
      </form>  
      </div>
      : <div onLoad={window.location.reload()}>Redirecting...</div>
      }
    </main>        
  )
}