import logo from '../../public/logo.svg'
import Image from 'next/image'
import styles from '../styles/loader.module.css'

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} />
      <Image
        className={styles.loaderImage}
        src={logo}
        alt='HOMMATORI'
        as='image'
        width={80}
        height={15}
      />
    </div>
  )
}