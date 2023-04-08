import styles from '../styles/modal.module.css'

export default function Modal({ message, closeModal }){

    return (
        <div id='errorModal' className={styles.errorModal}>
            <div className={styles.errorModalContent}>
                <span className={styles.errorModalClose} onClick={closeModal}>&times;</span>
                <p>{ message }</p>
            </div>
        </div>
    )
}