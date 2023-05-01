import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import cookie from 'cookie'
import AdDetails from '../components/form_components/ad-details.js'
import AdConfirmation from '../components/form_components/ad-confirmation.js'
import AdSuccess from '../components/form_components/ad-success.js'
import styles from '../styles/form.module.css'
import Loader from '@/components/loader.js'
import Modal from '../components/modal.js'

export const getServerSideProps = async ({ req, res }) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const accessToken = cookies['accessToken']
  const userCookie = cookies['userData']
  let userData = null
  let serverError = null

  if (!accessToken || !userCookie) {
    res.setHeader('location', '/login')
    res.statusCode = 302
    res.end()
    return { props: {} }
  }

  const cookieHeader = `accessToken=${accessToken}`
  const decodedUser = JSON.parse(decodeURIComponent(userCookie))
  try {
    const response = await fetch(`${process.env.NODEJS_URL}/userr/getprivatedata/${decodedUser.id}`, {
      headers: {
        Cookie: cookieHeader,
        credentials: 'include'
      },
    })
    if (!response.ok) {
      fetch(`${process.env.NEXTJS_URL}/api/logout`, {
        method: 'POST',
      })
      res.setHeader('location', '/login')
      res.statusCode = 302
      res.end()
      return { props: {} }
    }
    userData = await response.json()
    
  } catch (err) {
    // Server down or other server error
    serverError = 'Could not connect to the server - please try again later'
  }

  return {
    props: { userData, serverError },
  }
}

export default function Form({ translations, userData, serverError }) {
  const router = useRouter()
  const [userDataFromParams, setUserDataFromnParams] = useState(userData)
  const [step, setStep] = useState(1)
  const [type, setType] = useState('joboffer')
  const [header, setHeader] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState(0)
  const [region, setRegion] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [images, setImages] = useState([null, null, null])
  const [isLoading, setIsLoading] = useState(true)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState('')
  const [new_ad_ID, set_new_ad_ID] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-cookie-status')
        const data = await res.json()

        if (serverError) {
          setErrorModalMessage(serverError)
          setShowErrorModal(true)     
        } else if (!data.authenticated || !userData) {
          router.push('/login')
        } else {
          setShowErrorModal(false)  
          setIsLoading(false)
        }
      } catch (error) {}
    }
    checkAuth()
  }, [])

  const handleChange = (setter) => (e) => {
    setter(e.target.value)
  }

  function handleSubmit() {
    const checkAuthAndPublish = async () => {
      try {
        const res = await fetch('/api/return-token')
        const data = await res.json()
        
        if (!data.authenticated) {
          router.push('/login')
        } else {
          let token = data.token
          
          // Prepare form data
          const formData = new FormData()
          formData.append('type', type)
          formData.append('header', header)
          formData.append('description', description)
          formData.append('location', location)
          let newPrice = price;
          if (newPrice !== '' && newPrice[0] === '0' && newPrice.length > 1) {
            // Remove leading zero from price value if there are multiple digits
            newPrice = newPrice.toString().replace(/^0+/, '')
          }
          newPrice = newPrice === '' ? '' : Math.min(newPrice, 99999999)
          formData.append('price', newPrice)
          formData.append('region', region)
          formData.append('municipality', municipality)
          formData.append('userid', userDataFromParams.userid)
          
          images.forEach((image, index) => {
            if (image) {
              formData.append(`image${index + 1}`, image)
            }
          })

          try {
            const res = await fetch('/api/get-api-url')
            const nodeJsApiUrl = await res.text()

            const response = await fetch(`${nodeJsApiUrl}/ad`, {
              method: 'POST',
              body: formData,
              headers: {
                credentials: 'include',
                'Authorization': `Bearer ${token}`
              },
            })            
      
            if (!response.ok) {           
              const resData = await response.json()   
              setErrorModalMessage(resData.message)
              setShowErrorModal(true)
            } else {
              const resData = await response.json()
              set_new_ad_ID(resData.adid)
              setStep(3)
            }            
          } catch (error) {
            setErrorModalMessage('Error: Failed to connect to the server')
            setShowErrorModal(true)
          }
        }
      } catch (error) {
        setErrorModalMessage('Error: Failed to connect to the server')
        setShowErrorModal(true)
      }
    }
    checkAuthAndPublish()
  }

  const values = { type, header, description, location, price, region, municipality, images }

  return (
    <main className={styles.main}>
      { userData ? ( <>
        { step !== 3 && (
          <>
            <h3>{translations.publish.publish}</h3>
            <div className={styles.phase_breadcrumbs}>
              <p
                className={`${styles.phase_left} ${
                  step === 1 ? styles.phase_active : styles.phase_inactive
                }`}
              >
                {translations.publish.first_phase}
              </p>
              <p
                className={`${styles.phase_right} ${
                  step === 2 ? styles.phase_active : styles.phase_inactive
                }`}
              >
                {translations.publish.second_phase}
              </p>
            </div>
          </>
        )}
        { step === 1 ? (
          <AdDetails
            nextStep={() => setStep(2)}
            handleChange={handleChange}
            values={values}
            userData={userDataFromParams}
            setType={setType}
            setRegion={setRegion}
            setMunicipality={setMunicipality}
            setLocation={setLocation}
            setHeader={setHeader}
            setDescription={setDescription}
            setPrice={setPrice}
            setImages={setImages}
            translations={translations}
          />
        ) : step === 2 ? (
          <AdConfirmation
            prevStep={() => setStep(1)}
            values={values}
            submit={handleSubmit}
            translations={translations}
            userData={userDataFromParams}
          />
        ) : (
          <AdSuccess translations={translations} adid={new_ad_ID} fname={userData.fname} />
        )} </>
      ) : isLoading ? ( <Loader /> ) : ( <Loader /> )}

      {/* Informative modal will be shown in case of server request error */}
      {showErrorModal ? (
        <Modal
          message={errorModalMessage}
          closeModal={() => {
            setShowErrorModal(false);
            setErrorModalMessage('');
          }}
        />
      ) : (
        <></>
      )}
    </main>
  )
}