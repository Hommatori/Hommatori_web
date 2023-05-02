import { useEffect } from 'react'
import styles from '../../styles/signup.module.css'
import { useRouter } from 'next/router'

//This is part 4/4 of the multiphase signup form
export default function Success({ translations }) {
  const router = useRouter()

  useEffect(() => { //automatically scrolls to the top of the page, useful for mobile userss
    window.scrollTo(0, 0)
  }, [])

  setTimeout(function() {
    router.push('/account/profile')
  }, 3000)

  return (
    <div className={styles.signupSuccessView}>
      <h3>{translations.created}</h3>
      <p>{translations.redirect}</p>
    </div>
  )
}