import styles from '../styles/navbar.module.css'
import logo from '../../public/logo.svg'
import announce_icon from '../../public/messages.svg'
import user_icon_white from '../../public/user_square_white.svg'
import login_icon from '../../public/user_square.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import cookie from 'cookie'

// this is the navigation bar of the website. It receives locale (read: current language) and language translations as props
export default function Navbar({ locale, translations }) {
    const router = useRouter()
    const [shouldShowLogin, setShouldShowLogin] = useState(true)
    const [userName, setUserName] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      async function checkAuth() {
        try {
          const res = await fetch('/api/check-cookie-status')
          const data = await res.json()
  
          if (data.authenticated) {
            const cookies = cookie.parse(document.cookie || '')
            const userCookie = cookies['userData']
            const decodedUser = JSON.parse(decodeURIComponent(userCookie))
            setUserName(decodedUser.fname)
            setShouldShowLogin(false)
          } else {
            setShouldShowLogin(true)
          }
        } catch (error) {

        }
        setIsLoading(false)
      }
      checkAuth()
    }, [locale, router.asPath])

    return(
        <div className={styles.navbar}>
            <div className={styles.navbar_wrapper}>
                <Link href='/'>
                    <div className={styles.logoContainer}>
                        <Image
                            className={styles.logo}
                            src={logo}
                            alt='HOMMATORI'
                            as='image'
                            fill
                            style={{ objectFit: 'contain' }}
                            priority={true}
                        />
                    </div>
                </Link>
                { isLoading ? <></> : 

                <div className={styles.navbar_navigation_icons}>                    
                    <Link href={shouldShowLogin ? '/login/?source=/form' : '/form'} className={styles.announce_btn}>{translations.announce}</Link>
                    <Link href={shouldShowLogin ? '/login/?source=/form' : '/form'} className={styles.announce_btn_mobile}>
                        <Image
                            src={announce_icon}
                            alt={translations.announce}
                            as='image'
                            fill
                            style={{ objectFit: 'contain' }}
                            priority={true}
                        />
                </Link>
                    {
                        shouldShowLogin ?                        
                        <>
                        <Link href={`/login/?source=${router.asPath}`} className={styles.log_in_btn}>{translations.log_in}</Link>
                        <Link href={`/login/?source=${router.asPath}`} className={styles.log_in_btn_mobile}>
                            <Image
                                src={login_icon}
                                alt={translations.log_in}
                                as='image'
                                fill
                                style={{ objectFit: 'contain' }}
                                priority={true}
                            />
                        </Link></>
                        :<>
                        { userName && !shouldShowLogin && (
                            <><Link href='/account' className={styles.account_btn}>
                                <div className={styles.account_btn_img_wrapper}>
                                    <Image
                                        src={user_icon_white}
                                        alt={translations.log_in}
                                        className={styles.account_btn_img_white}
                                        fill
                                        style={{ objectFit: 'contain' }} />
                                    <Image
                                        src={login_icon}
                                        alt={translations.log_in}
                                        className={styles.account_btn_img_black}
                                        fill
                                        style={{ objectFit: 'contain' }} />
                                </div>
                                {userName}
                            </Link>
                            <Link href='/account' className={styles.account_btn_mobile}>
                                <Image
                                    src={login_icon}
                                    alt={translations.log_in}
                                    as='image'
                                    fill
                                    style={{ objectFit: 'contain' }} />
                            </Link></>
                        )}</>}
                    <div className={styles.language_selector}>
                        {
                            locale == 'fi' ?  <Link className={styles.link} href={router.asPath} locale='en'>ENGLISH</Link>
                            :
                            <Link className={styles.link} href={router.asPath} locale='fi'>SUOMI</Link>
                        }
                    </div>
                </div>
                }                
            </div>     
        </div>
    )
}
  