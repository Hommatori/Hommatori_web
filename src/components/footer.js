import styles from '../styles/footer.module.css'

// this is the footer of the website. It receives language translations as props
export default function Footer({ translations }) {
  return(
    <div className={styles.footer}>
      <div className={styles.footer_wrapper}>
        <a>Footer</a>
      </div>      
    </div>
  )
}
