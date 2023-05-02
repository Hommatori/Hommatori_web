import { useEffect, useState } from 'react'
import styles from '../../styles/signup.module.css'

// This is part 1/4 of the multiphase signup form
export default function UserDetails ({
    translations,
    setStep,
    setFname,
    setLname,
    setEmail,
    setPhonenumber,
    setUsername,
    values }) {

    const [emailTaken, setEmailTaken] = useState(false)
    const [usernameTaken, setUsernameTaken] = useState(false)

    useEffect(() => { //automatically scrolls to the top of the page, useful for mobile users
        window.scrollTo(0, 0)
    }, [])

    async function checkEmailAvailability() {
        try {
          const response = await fetch(`/api/validate-email?email=${values.email}`)
          if (response.status === 200) {
            setEmailTaken(false)
          }
          if (response.status === 400) {
            setEmailTaken(true)
          } else {
            //alert('Error: Failed to fetch data from server in order to validate email')
          }
        } catch (error) {
          alert('Error: Failed to fetch data from server in order to validate email')
        }
    }

    async function checkUsernameAvailability() {
        try {
          const response = await fetch(`/api/validate-username?username=${values.username}`)
          if (response.status === 200) {
            setUsernameTaken(false)
          }
          if (response.status === 400) {
            setUsernameTaken(true)
          } else {
            alert('Error: Failed to fetch data from server in order to validate email')
          }
        } catch (error) {
            alert('Error: Failed to fetch data from server in order to validate email')
        }
    }
    function handleSubmit(e) {
        e.preventDefault()
        if(!emailTaken && !usernameTaken){
            setStep(2)
        }
    }

    return (
    <div className={styles.Signup}>
        <div className={styles.signupContent}>
            <h2 className={styles.signupTitle}>{translations.form_title}</h2>
            <p className={styles.signupSubTitle}>{translations.form_subtitle_top}</p>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                <div className={styles.formTop}>
                    <div className={styles.formColumn}>
                        <div className={styles.signupInputTitle}>{translations.fname}:</div>
                        <input
                            type='text'
                            className={styles.signupField}
                            name='fname'
                            placeholder={translations.fname.toLowerCase()}
                            onChange={(e) => setFname(e.target.value)}
                            defaultValue={values.fname}
                            autoComplete='off'
                            maxLength={30}
                            minLength={3}
                            required />
                        <div className={styles.signupInputTitle}>{translations.lname}:</div>
                        <input
                            type='text'
                            className={styles.signupField}
                            name='lname'
                            placeholder={translations.lname.toLowerCase()}
                            onChange={(e) => setLname(e.target.value)}
                            defaultValue={values.lname}
                            autoComplete='off'
                            maxLength={30}
                            minLength={3}
                            required />
                            <div className={styles.signupInputTitle}>{translations.username}:</div>
                        <input
                            onBlur={checkUsernameAvailability}
                            type='text'
                            className={styles.signupField}
                            name='username'
                            placeholder={translations.username.toLowerCase()}
                            onChange={(e) => setUsername(e.target.value)}
                            defaultValue={values.username}
                            autoComplete='off'
                            maxLength={30}
                            minLength={5}
                            required />
                            { usernameTaken && <div className={styles.exists_warning}>{translations.username_taken}</div> }
                    </div>
                    <div className={styles.formColumn}>
                        <div className={styles.signupInputTitle}>{translations.email}:</div>
                        <input
                            onBlur={checkEmailAvailability}
                            type='email'
                            pattern='^[a-zäö-åA-ZÄÖÅ0-9._%+-]+@[a-zäöå-A-ZÄÖÅ0-9.-]+\.[a-zäöå-A-ZÄÖÅ]{2,}$'
                            className={styles.signupField}
                            name='email'
                            title={translations.email_hint}
                            placeholder={translations.email.toLowerCase()}
                            onChange={(e) => {
                                const lowercaseValue = e.target.value.toLowerCase()
                                console.log(lowercaseValue)
                                setEmail(lowercaseValue)
                            }}
                            value={values.email}
                            autoComplete='off'
                            maxLength={30}
                            required />
                            { emailTaken && <div className={styles.exists_warning}>{translations.email_taken}</div> }
                        <div className={styles.signupInputTitle}>{translations.phone}:</div>
                        <input
                            type='text'                            
                            title={translations.phone_hint}
                            className={styles.signupField}
                            name='phonenumber'
                            placeholder={translations.phone.toLowerCase()}
                            onChange={(e) => {
                                const pattern = /^[0-9]*$/
                                if (!pattern.test(e.target.value)) {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                } else {
                                  setPhonenumber(e.target.value)
                                }
                            }}
                            defaultValue={values.phonenumber}
                            autoComplete='off'
                            maxLength={12}
                            minLength={10}
                            required />                    
                    </div>
                </div>
                <div className={styles.formBottom}>
                    <button type='submit' className={styles.multiphaseFormBtn}>{translations.next}</button> 
                </div>             
            </form>
            
        </div>
    </div>
  )
}
