import React from 'react'
import styles from '../styles/delete-modal.module.css'
import { useState } from 'react'

const DeleteModal = ({ title, yes, no, message, onDelete, email, onCancel, instructions }) => {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showDeleteBtn, setShowDeleteBtn] = useState(false)

  const handleInputChange = (event) => {
    const value = event.target.value
    if (value === email) {
      setShowDeleteBtn(true)
      console.log('Input matches email parameter')
    } else {
      setShowDeleteBtn(false)
    }    
    setInputValue(value)
  }

  return (
    <div className={styles.modal}>
      <span onClick={onCancel} className={styles.close} title='Close Modal'>&times;</span>
      <div className={styles.modalContent}>
        <div className={styles.container}>
          <h3>{title}</h3>
          <p>{message}</p>
          <div className={styles.clearfix}>
            <button onClick={() => onCancel()} className={styles.cancelbtn}>{no}</button>
            <button onClick={() => setShowInput(true)} className={styles.deletebtn}>{yes}</button>
          </div>
          { showInput && <>
          <p>{instructions.insert_email}</p>
          <input 
            className={styles.email_input}
            onChange={handleInputChange}
            placeholder={instructions.email}
            value={inputValue} >
          </input></> }
          { showInput && showDeleteBtn &&
            <p className={styles.deletePermanently} onClick={() => onDelete()}>{instructions.delete}</p>
        }
        </div>
      </div>
    </div>
  )
}

export default DeleteModal