import Head from 'next/head'
import UserDetails from '../components/signup/user-details.js'
import Confirmation from '../components/signup/confirmation.js'
import CreatePassword from '../components/signup/create-password.js'
import Success from '../components/signup/success.js'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/signup.module.css'

export default function Signup({ translations }) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [phonenumber, setPhonenumber] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const checkAuth = async () => {
        try {
            const res = await fetch('/api/check-cookie-status')
            const data = await res.json()

            if (data.authenticated) {
            router.push('/account')
            }
        } catch (error) { }
        }
        checkAuth()
    }, [])

    const handleSignup = async (e) => {
        e.preventDefault()
        setStep(4) // Switches to processing view
      
        try {
            const res = await fetch('/api/get-api-url')
            const nodeJsApiUrl = await res.text()
        
            const formData = new FormData()
            formData.append('fname', fname)
            formData.append('lname', lname)
            formData.append('email', email)
            formData.append('phonenumber', phonenumber)
            formData.append('username', username)
            formData.append('password', password)

            const formDataToObject = (formData) => {
                const obj = {}
                for (const [key, value] of formData.entries()) {
                  obj[key] = value
                }
                return obj
            }
              
            const formDataObject = formDataToObject(formData);

            const signUpResult = await fetch(`${nodeJsApiUrl}/signup`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObject),
            })
        
            if (signUpResult.status === 201) {
                const token = Buffer.from(`${email}:${password}`).toString('base64')
                const loginResponse = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${token}`,
                    },
                    credentials: 'include',
                })
            
                if (loginResponse.status === 200) {
                    // JWT saved by NextJS api
                    setStep(5)
                } else {
                    alert('Signup successfull but login failed. Please contact support.')
                    setStep(1)
                }
            } else {
                alert('Signup failed')
                setStep(1)
            }
        } catch (error) {
            setStep(1)
            alert(`Account creation failed, please try again.`)
        }
    }

  const values = { fname, lname, email, phonenumber, username, password }

  return (
    <>
      <Head>
        <title>{translations.homepage.metadata.title}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta property='og:site_name' content='Hommatori.fi' />
        <meta property='og:title' content={''} />
        <meta property='og:description' content={''} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='http://www.hommatori.fi' />
        <meta name='keywords' content={''} />
        <meta name='description' content={''} />
        <link rel='canonical' href='http://www.hommatori.fi/' />
        <link rel='shortcut icon' href='hommatori_favicon.ico' />
        <link rel='icon' href='hommatori_favicon.ico' />
      </Head>

      <main className={styles.main}>
        {step === 1 ? (
          <UserDetails
                translations={translations.register}
                setStep={setStep}
                setFname={setFname}
                setLname={setLname}
                setEmail={setEmail}
                setPhonenumber={setPhonenumber}
                setUsername={setUsername}
                values={values} />
           ) : step === 2 ? (
            <Confirmation
                translations={translations.register}
                setStep={setStep}
                values={values} />
            ) : step === 3 ? (
            <CreatePassword
                translations={translations.register}
                setStep={setStep}
                setPassword={setPassword}
                handleSignup={handleSignup}
                values={values} />
            ) : step === 4 ? (
            <div className={styles.processingSignup}>
                <h2>{translations.register.creating}</h2>
                <div>{translations.register.wait}</div>
                <div className={styles.processRoller}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                </div>
            </div>
            ) : (
            <Success translations={translations.register}/>
            )}
        </main>
        </>
    )
}
