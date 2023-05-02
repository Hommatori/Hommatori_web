import { useEffect } from 'react'
import styles from '../../styles/signup.module.css'

//This is part 2/4 of the multiphase signup form
export default function Confirmation ({ translations, setStep, values,}) {

    useEffect(() => { //automatically scrolls to the top of the page, useful for mobile userss
        window.scrollTo(0, 0)
      }, [])

    return (
<div className={styles.Signup}>
        <div className={styles.signupContent}>
            <h2 className={styles.signupTitle}>{translations.form_title_confirm}</h2>
            <p className={styles.signupSubTitle}>{translations.form_subtitle_top_confirm}</p>
            <form className={styles.signupForm}>
                <div className={styles.formTop}>
                    <div className={styles.formColumn}>
                        <div className={styles.signupInputTitle}>{translations.fname}:</div>
                        <input className={styles.signupFieldDisabled} value={values.fname} disabled='true'/>
                        <div className={styles.signupInputTitle}>{translations.lname}:</div>
                        <input className={styles.signupFieldDisabled} value={values.lname} disabled='true'/>
                        <div className={styles.signupInputTitle}>{translations.username}:</div>
                        <input className={styles.signupFieldDisabled} value={values.username} disabled='true'/>                        
                    </div>
                    <div className={styles.formColumn}>
                        <div className={styles.signupInputTitle}>{translations.email}:</div>
                        <input className={styles.signupFieldDisabled} value={values.email} disabled='true'/>
                        <div className={styles.signupInputTitle}>{translations.phone}:</div>
                        <input className={styles.signupFieldDisabled} value={values.phonenumber} disabled='true'/>                    
                    </div>
                </div>                          
            </form>
            <div className={styles.formBottomConfirmation}>
                <button className={styles.multiphaseFormBtnBack} onClick={() => setStep(1)}>{translations.continue_editing}</button>
                <button className={styles.multiphaseFormBtnGo} onClick={() => setStep(3)}>{translations.continue}</button>
            </div>
        </div>
    </div>                   
    )
}