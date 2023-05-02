import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/signup.module.css'
import eye_open from '../../../public/password_eye.png'
import eye_closed from '../../../public/password_eye_closed.png'
import Image from 'next/image'
import Link from 'next/link'

export default function CreatePassword({ translations, handleSignup, setPassword, values }) {
  const passwordInput = useRef()
  const passwordEye = useRef()
  const letterRef = useRef()
  const capitalRef = useRef()
  const numberRef = useRef()
  const lengthRef = useRef()
  const passwordCreatingTipRef = useRef()
  const signupSubmitRef = useRef()
  const [passwordEyeSrc, setPasswordEyeSrc] = useState(eye_closed)


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const eye = passwordEye.current

    function handleMouseDown() {
        setPasswordEyeSrc(eye_open)
        passwordInput.current.type = 'text'
    }

    function handleMouseUp() {
        setPasswordEyeSrc(eye_closed)
        passwordInput.current.type = 'password'
    }

    eye.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      eye.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  function handlePasswordInput(e) {
    setPassword(e.target.value)

    const lowerCaseLetters = /[a-ö]/g
    const upperCaseLetters = /[A-Z]/g
    const numbers = /[0-9]/g

    const letter = e.target.value.match(lowerCaseLetters) ? 'valid' : 'invalid'
    const capital = e.target.value.match(upperCaseLetters) ? 'valid' : 'invalid'
    const number = e.target.value.match(numbers) ? 'valid' : 'invalid'
    const length = e.target.value.length >= 6 ? 'valid' : 'invalid'

    letterRef.current.className = styles[letter]
    capitalRef.current.className = styles[capital]
    numberRef.current.className = styles[number]
    lengthRef.current.className = styles[length]

    const allValid = letter === 'valid' && capital === 'valid' && number === 'valid' && length === 'valid'
    passwordCreatingTipRef.current.style.display = allValid ? 'none' : 'block'
    signupSubmitRef.current.style.display = allValid ? 'block' : 'none'
  }

  return (
    <div className={styles.Signup}>
      <div className={styles.signupContent}>
        <p className={styles.signupDisclaimer}>{translations.almost_ready}, <br/> {translations.by_creating_you_accept}{' '}
          <Link className={styles.disclaimer_link} href='/disclaimer' target='_blank' rel='noopener noreferrer'>{translations.our_disclaimer}</Link>.
        </p>

        <form className={styles.passwordForm}>
          <input
            type='password'
            className={styles.signupPassword}
            name='password'
            placeholder={translations.create_password}
            ref={passwordInput}
            onChange={handlePasswordInput}
            defaultValue={values.password}
            autoComplete='off'
            maxLength={30}
          />
          <Image className={styles.passwordEye} ref={passwordEye} src={passwordEyeSrc} alt='show' width={25} height={'auto'} />
        </form>        

        <div ref={passwordCreatingTipRef}>
          <h3>{translations.password_requirements}:</h3>
          <p ref={letterRef} className={styles.invalid}>
            {translations.a} <b>{translations.lowercase}</b> {translations.letter}
          </p>
          <p ref={capitalRef} className={styles.invalid}>
          {translations.a} <b>{translations.uppercase}</b> {translations.letter}
          </p>
          <p ref={numberRef} className={styles.invalid}>
          {translations.a} <b>{translations.number}</b>
          </p>
          <p ref={lengthRef} className={styles.invalid}>
          {translations.min} <b>{translations.chars}</b>
          </p>
        </div>
        <button ref={signupSubmitRef} onClick={handleSignup} className={styles.signupSubmit}>
          {translations.create}
        </button>
      </div>
    </div>
  )
}

