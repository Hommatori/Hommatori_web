import styles from './header.module.css'
import logo from './../../public/logo.svg'
import Image from 'next/image'

export default function Header({ translations, switchLanguage }) {
    return(
        <div className={styles.header}>
            <div className={styles.header_wrapper}>
                <Image
                    className={styles.logo}
                    priority
                    src={logo}
                    height={38}
                    alt="HOMMATORI"
                />
                <div className={styles.header_navigation_icons}>                    
                    <p className={styles.messages_btn}>{translations.messages}</p>
                    <p className={styles.log_in_btn}>{translations.log_in}</p>
                    <p onClick={() => switchLanguage("fi")}>FI</p>
                    <p onClick={() => switchLanguage("en")}>EN</p>
                </div>                
            </div>            
        </div>
    )
}
  