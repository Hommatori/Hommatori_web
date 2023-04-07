import styles from '../styles/navbar.module.css'
import logo from './../../public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

// this is the navigation bar of the website. It receives locale (read: current language) and language translations as props
export default function Navbar({locale, translations }) {
    const router = useRouter()

    return(
        <div className={styles.navbar}>
            <div className={styles.navbar_wrapper}>
                <Link href="/">
                    <Image
                        className={styles.logo}
                        src={logo}
                        height={37}
                        alt="HOMMATORI"
                        as="image"
                    />
                </Link>
                <div className={styles.navbar_navigation_icons}>                    
                    <p className={styles.messages_btn}>{translations.messages}</p>
                    <Link href="/account" className={styles.log_in_btn}>{translations.log_in}</Link>
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
  