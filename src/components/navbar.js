import styles from '../styles/navbar.module.css'
import logo from './../../public/logo.svg'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar({ locale, translations }) {

    return(
        <div className={styles.navbar}>
            <div className={styles.navbar_wrapper}>
                <Link href="/">
                    <Image
                        className={styles.logo}
                        src={logo}
                        height={37}
                        alt="HOMMATORI"
                        priority={true}
                    />
                </Link>
                <div className={styles.navbar_navigation_icons}>                    
                    <p className={styles.messages_btn}>{translations.messages}</p>
                    <Link href="/account" className={styles.log_in_btn}>{translations.log_in}</Link>
                    <div className={styles.language_selector}>
                        {
                            locale == "fi" ?  <Link className={styles.link} href="/en">ENGLISH</Link>
                            :
                            <Link className={styles.link} href="/" locale="fi">SUOMI</Link>
                        }
                    </div>
                </div>
            </div>     
        </div>
    )
}
  