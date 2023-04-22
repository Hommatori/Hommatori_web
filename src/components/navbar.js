import styles from '../styles/navbar.module.css'
import logo from './../../public/logo.svg'
import messages_icon from './../../public/messages.svg'
import login_icon from './../../public/user_square.svg'
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
                    <div className={styles.logoContainer}>
                        <Image
                            className={styles.logo}
                            src={logo}
                            alt="HOMMATORI"
                            as="image"
                            fill
                            style={{ objectFit: 'contain' }}  
                        />
                    </div>
                </Link>
                <div className={styles.navbar_navigation_icons}>                    
                    <Link href="/messages" className={styles.messages_btn}>{translations.messages}</Link>
                    <Link href="/messages" className={styles.messages_btn_mobile}>
                        <Image
                            className={styles.cs}
                            src={messages_icon}
                            alt={translations.messages}
                            as="image"
                            fill
                            style={{ objectFit: 'contain' }}  
                        />
                    </Link>
                    <Link href="/account" className={styles.log_in_btn}>{translations.log_in}</Link>
                    <Link href="/account" className={styles.log_in_btn_mobile}>
                        <Image
                            src={login_icon}
                            alt={translations.log_in}
                            as="image"
                            fill
                            style={{ objectFit: 'contain' }}  
                        />
                    </Link>
                    
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
  