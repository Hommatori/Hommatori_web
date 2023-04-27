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

    useEffect(() => {
        const cookies = cookie.parse(document.cookie || "")
        const userCookie = cookies["user"]
        const sessionCookie = cookies["session"]
        setShouldShowLogin(Boolean(!userCookie || !sessionCookie))
        if (!shouldShowLogin) {
            const decodedUser = JSON.parse(decodeURIComponent(userCookie))
            setUserName(decodedUser.fname)
        }
    })

    return(
        <div className={styles.navbar}>
            <div className={styles.navbar_wrapper}>
                <Link href="/">
                    <div className={styles.logoContainer}>
                        <Image
                            className={styles.logo}
                            src={logo}
                            alt="HOMMATORI"
                            as="image"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority={true}
                        />
                    </div>
                </Link>
                <div className={styles.navbar_navigation_icons}>                    
                    <Link href="/form" className={styles.announce_btn}>{translations.announce}</Link>
                    <Link href="/form" className={styles.announce_btn_mobile}>
                        <Image
                            src={announce_icon}
                            alt={translations.announce}
                            as="image"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority={true}
                        />
                </Link>
                    {
                        shouldShowLogin ?                        
                        <>
                        <Link href="/login" className={styles.log_in_btn}>{translations.log_in}</Link>
                        <Link href="/login" className={styles.log_in_btn_mobile}>
                            <Image
                                src={login_icon}
                                alt={translations.log_in}
                                as="image"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority={true}
                            />
                        </Link></>
                        :<>
                        {userName && !shouldShowLogin && (
                            <>
                                <Link href="/account" className={styles.account_btn}>
                                    <div className={styles.account_btn_img_wrapper}>
                                        <Image
                                            src={user_icon_white}
                                            alt={translations.log_in}
                                            className={styles.account_btn_img_white}
                                        />
                                        <Image
                                            src={login_icon}
                                            alt={translations.log_in}
                                            className={styles.account_btn_img_black}
                                        />
                                    </div>
                                    {userName}
                                </Link>
                                <Link href="/account" className={styles.account_btn_mobile}>
                                    <Image
                                        src={login_icon}
                                        alt={translations.log_in}
                                        as="image"
                                        fill
                                        style={{ objectFit: "contain" }}
                                    />
                                </Link>
                            </>
                        )}</>
                    }
                    <div className={styles.language_selector}>
                        {
                            locale == "fi" ?  <Link className={styles.link} href={router.asPath} locale="en">ENGLISH</Link>
                            :
                            <Link className={styles.link} href={router.asPath} locale="fi">SUOMI</Link>
                        }
                    </div>
                </div>
            </div>     
        </div>
    )
}
  