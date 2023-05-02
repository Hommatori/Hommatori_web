import React from 'react'
import styles from '../styles/delete-modal.module.css'

const DeleteModal = ({ title, yes, no, message, onDelete, onCancel }) => {

  return (
    <div className={styles.modal}>
      <span onClick={onCancel} className={styles.close} title='Close Modal'>&times;</span>
      <div className={styles.modalContent}>
        <div className={styles.container}>
          <h3>{title}</h3>
          <p>{message}</p>
          <div className={styles.clearfix}>
            <button onClick={() => onCancel() } className={styles.cancelbtn}>{no}</button>
            <button onClick={() => onDelete() } className={styles.deletebtn}>{yes}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal