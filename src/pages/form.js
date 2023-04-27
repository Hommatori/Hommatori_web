import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import cookie from 'cookie'
import AdForm from '../components/form_components/ad-details.js'
import AdConfirmation from '../components/form_components/ad-confirmation.js'
import styles from '../styles/form.module.css'

export const getServerSideProps = async ({ req, res }) => {
  const cookies = cookie.parse(req.headers.cookie || '')
  const accessToken = cookies['accessToken']
  const userCookie = cookies['userData']
  let userData = null
  let shouldRedirect = false

  if (!accessToken || !userCookie) {
    res.setHeader('location', '/login')
    res.statusCode = 302
    res.end()
    shouldRedirect = true
    return { props: {} }
  }

  const cookieHeader = 'accessToken=' + accessToken
  const decodedUser = JSON.parse(decodeURIComponent(userCookie))
  try {
    const response = await fetch('http://localhost:8080/userr/getprivatedata/' + decodedUser.id, {
      headers: {
        Cookie: cookieHeader,
        credentials: 'include'
      },
    })
    if (!response.ok) {
      res.setHeader('location', '/login')
      res.statusCode = 302
      res.end()
      shouldRedirect = true
      return { props: {} }      
    }
    userData = await response.json()
  } catch (err) {}

  return {
    props: { userData, shouldRedirect },
  }
}

export default function Form({ translations, userData, shouldRedirect }) {
  const router = useRouter()
  const [userDataFromParams, setUserDataFromnParams] = useState(userData)
  const [step, setStep] = useState(1)
  const [type, setType] = useState('')
  const [header, setHeader] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(0)
  const [price, setPrice] = useState(0)
  const [region, setRegion] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [image, setImage] = useState(null)

  useEffect(() => {
    const requiredCookies = ['accessToken', 'userData']
    const cookies = document.cookie.split('; ').reduce((acc, c) => {
      const [key, value] = c.split('=')
      acc[key] = value
      return acc
    }, {})
    const hasCookies = requiredCookies.every((cookieName) =>
      cookies.hasOwnProperty(cookieName)
    )
    if (!hasCookies) {
      router.push('/login')
      return
    } else {
      // Automatically scrolls to the top of the page, useful for mobile users
      window.scrollTo(0, 0)
    }
  }, [])

  const prevStep = (e) => {
    e.preventDefault()
    setStep(1)
  }

  const nextStep = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleChange = (setter) => (e) => {
    setter(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const requiredCookies = ['user', 'session']
    const cookies = document.cookie.split('; ').reduce((acc, c) => {
      const [key, value] = c.split('=')
      acc[key] = value
      return acc
    }, {})
  
    const hasCookies = requiredCookies.every((cookieName) => cookies.hasOwnProperty(cookieName))
    if (!hasCookies || !userDataFromParams) {
      router.push('/login')
    } else {
      // Prepare form data
      const formData = new FormData()
      formData.append('type', type)
      formData.append('header', header)
      formData.append('description', description)
      formData.append('location', location)
      formData.append('price', price)
      formData.append('userid', userDataFromParams.userid)
      formData.append('region', region)
      formData.append('municipality', municipality)
      if (image) {
        formData.append('image', image)
      }
  
      try {
        // Replace the URL with your API endpoint
        const response = await fetch('http://localhost:8080/ad', {
          method: 'POST',
          body: formData,
          headers: {
            Cookie: 'user=' + cookies.user + '; session=' + cookies.session,
          },
        })
  
        if (!response.ok) {
          throw new Error('HTTP error! Status: ' + response.status)
        }
  
        const data = await response.json()
        console.log(data)
        console.log('successfully added new ad')
  
        // Handle success (e.g., show a success message, navigate to another page)
      } catch (error) {
        console.error('Error submitting form data:', error)
  
        // Handle error (e.g., show an error message)
      }
    }
  }

  const values = { type, header, description, location, price, region, municipality, image }

  return (
    <main className={styles.main}>
      { !shouldRedirect ?
      <>
      <h3>{translations.publish.publish}</h3>
      <div>{step == 1 ? translations.publish.first_phase : translations.publish.second_phase}</div>
      { step == 1 ?
        <AdForm
          nextStep={nextStep}
          handleChange={handleChange}
          values={values}
          userData={userDataFromParams}
          setType={setType}
          setRegion={setRegion}
          setMunicipality={setMunicipality}
          setHeader={setHeader}
          setDescription={setDescription}
          setPrice={setPrice}
          setImage={setImage}
          translations={translations} />
        :
        <AdConfirmation
          prevStep={prevStep}
          values={values} 
          submit={handleSubmit}
          translations={translations} />
      }
      </>
      : <div onLoad={window.location.reload()}>Redirecting...</div>
    }
    </main>
  )
}