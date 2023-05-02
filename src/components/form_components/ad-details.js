import React, { useEffect } from 'react'
import styles from '../../styles/form-details.module.css'
import regions from '../../json/regions'
import Image from 'next/image'

//This is part 1/3 of the multiphase ad upload form
export default function AdDetails ({
    nextStep,
    values,
    setType,
    setRegion,
    setMunicipality,
    setLocation,
    setHeader,
    setDescription,
    setPrice,
    setImages,
    userData,
    translations
}) {

    function handleRegionChange(value) {
        setRegion(value)
        setMunicipality('')
        document.getElementById('select_municipality').selectedIndex = -1
    }

    function handleNextStep(e) {
        e.preventDefault()
        let hasError = false

        const region_element = document.getElementById('region_alert')
        const municipality_element = document.getElementById('municipality_alert')        
        const header_element = document.getElementById('header_alert')
        const description_element = document.getElementById('description_alert')
        const location_element = document.getElementById('location_alert')
        region_element.classList.add(styles.hide)
        municipality_element.classList.add(styles.hide)
        header_element.classList.add(styles.hide)
        description_element.classList.add(styles.hide)
        location_element.classList.add(styles.hide)

        if(values.region === ''){
            hasError = true
            region_element.classList.remove(styles.hide)
        }
        if(values.municipality === ''){
            hasError = true
            municipality_element.classList.remove(styles.hide)
        }
        if(values.location.length !== 5){
            hasError = true
            location_element.classList.remove(styles.hide)
        }
        if(values.header.length < 5){
            hasError = true
            header_element.classList.remove(styles.hide)
        }
        if(values.description.length < 20){
            hasError = true
            description_element.classList.remove(styles.hide)
        }
        if(!hasError){
            nextStep()
        }        
    }    

    function handleImageChange(e, index) {
        const newImages = [...values.images]
        const firstEmptyIndex = newImages.findIndex((img) => img === null)
        if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
          newImages[firstEmptyIndex] = e.target.files[0]
        } else {
          newImages[index] = e.target.files[0]
        }        
        setImages(newImages)
    }
    
    function handleRemoveImage(index) {
        const newImages = [...values.images]
        newImages.splice(index, 1)
        newImages.push(null)
        setImages(newImages)
    }
    
    const imageInputs = (
        <>
        <div className={styles.form_row_images}>
            <p className={styles.form_input_title}>{translations.publish.images}</p>
            { [0, 1, 2].map((index) => (
                <div key={index} className={styles.image_upload_wrapper}>
                    <input
                        className={styles.hiddenImageUploadInput} // Hide the input with a new class
                        type='file'
                        id={`imageFileInput${index}`} // Add an id for selecting the input later
                        onChange={(e) => handleImageChange(e, index)}
                        autoComplete='off'
                        accept='.png, .jpg, .jpeg' />
                    {values.images[index] ? (
                        <div className={styles.singleImageWrapper}>
                            <p className={styles.single_image_title}>{translations.publish.one_image} {index + 1}</p>
                            <div className={styles.singleImageContainer}>
                                <Image
                                    src={URL.createObjectURL(values.images[index])}
                                    alt={`Uploaded ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }} />
                            </div>
                            <button
                                type='button'
                                className={styles.removeImageButton}
                                onClick={() => handleRemoveImage(index)} >
                                {translations.publish.remove_photo}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.singleUploadBtn}>
                            {
                                values.images[0] ? <p className={styles.hiddenSingleUploadBtnText}>{translations.publish.one_image} {index + 1}</p>
                                : <></>
                            }                            
                            <button
                                type='button'
                                className={values.images[0] ? styles.uploadImageButton :styles.uploadImageButton_btnsonly}
                                onClick={() => document.getElementById(`imageFileInput${index}`).click()} >
                                {translations.publish.add_image}
                            </button>
                        </div>
                    )}
                </div>
            ))}
            <span className={styles.form_bottom_valuehint}>{translations.publish.optional_image}</span>
        </div>
        <span className={styles.form_bottom_valuehint_mobile}>{translations.publish.optional_image}</span>
        </>
    )
    

    return (
        <div className={styles.editContent}>
            <form className={styles.editForm} onSubmit={ (e) => handleNextStep(e) }>
                <div className={styles.form_top}>
                    <div className={styles.form_wrapper_title}>{translations.publish.type_and_location}</div>
                    <div className={styles.form_row}>
                        <p className={styles.form_input_title}>{translations.publish.region}</p>
                        <select value={values.region} className={styles.form_dropdown} onChange={(e) => handleRegionChange(e.target.value)}>
                            <option value='' className={styles.dropdown_default}>{translations.publish.choose_region}</option>
                            {
                                Object.keys(regions).map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })  
                            }
                        </select>                        
                    </div>
                    <p id='region_alert' className={`${styles.incorrect_input_alert} ${styles.hide}`}>{translations.publish.region_alert}</p>
                    <div className={styles.form_row}>
                        <p className={styles.form_input_title}>{translations.publish.municipality}</p>
                        <select value={values.municipality} className={styles.form_dropdown} onChange={(e) => setMunicipality(e.target.value)} id='select_municipality'>
                            <option value='' className={styles.dropdown_default}>{translations.publish.choose_municipality}</option>
                            {
                                regions[values.region]?.map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })  
                            }
                        </select>
                    </div>
                    <p id='municipality_alert' className={`${styles.incorrect_input_alert} ${styles.hide}`}>{translations.publish.municipality_alert}</p>
                    <div className={styles.form_row}>
                        <p className={styles.form_input_title}>{translations.publish.postnumber}</p>
                        <input
                            value={values.location || ''}
                            type='number'
                            minLength='5'
                            maxLength='5'
                            className={styles.form_location_input}
                            onChange={(e) => {
                                const newLocation = e.target.value.substring(0, 5)
                                setLocation(newLocation)
                            }}
                            autoComplete='off'
                            required />
                    </div>
                    <p id='location_alert' className={`${styles.incorrect_input_alert} ${styles.hide}`}>{translations.publish.location_alert}</p>
                    <div className={styles.form_row}>
                        <p className={styles.form_input_title}>{translations.publish.type}</p>
                        <label className={styles.checkboxContainer}>{translations.publish.joboffer}
                            <input
                                type='radio'
                                name='type'
                                className={styles.form_radioBtn}
                                onClick={(e) => setType(e.target.value)}
                                value='joboffer'
                                checked={values.type === 'joboffer'}
                                readOnly />
                            <span className={styles.checkmark}></span>
                        </label>
                        <label className={styles.checkboxContainer}>{translations.publish.jobseeker}
                            <input
                                type='radio'
                                name='type'
                                className={styles.form_radioBtn}
                                onClick={(e) => setType(e.target.value)}
                                value='jobseeker'
                                checked={values.type === 'jobseeker'}
                                readOnly />
                            <span className={styles.checkmark}></span>
                        </label>
                    </div>
                </div>   

            <div className={styles.form_middle}>
                <div className={styles.form_wrapper_title}>{translations.publish.info}</div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.title}</p>
                    <input
                        value={values.header || ''}
                        type='text'
                        className={styles.form_text_input}
                        onChange={(e) => setHeader(e.target.value)}
                        autoComplete='off'
                        maxLength='50'
                        required />
                </div>
                <p id='header_alert' className={`${styles.incorrect_input_alert} ${styles.hide}`}>{translations.publish.header_alert}</p>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.description}</p>
                    <textarea
                        value={values.description || ''}
                        type='text'
                        className={styles.form_textarea_description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength='1500'
                        required />
                </div>
                <p id='description_alert' className={`${styles.incorrect_input_alert} ${styles.hide}`}>{translations.publish.description_alert}</p>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.price}</p>
                    <div className={styles.price_inner_wrapper}>
                        <input
                            value={values.price !== undefined ? values.price : ''}
                            type='number'
                            min='0'
                            max='99999999'
                            className={styles.form_price_input}
                            onChange={(e) => {
                                const newPrice = e.target.value === '' ? '' : Math.min(e.target.value, 99999999)
                                setPrice(newPrice)
                            }}
                            autoComplete='off'
                            required /><span className={styles.eur_mark }>€</span>
                        </div>
                </div>
                { imageInputs }
            </div>

            <div className={styles.form_bottom}>
                <div className={styles.form_wrapper_title}>{translations.publish.contact_info}</div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.name}</p>
                    <input
                        value={userData.fname + ' ' + userData.lname}
                        type='text'
                        className={styles.form_bottom_text_input}
                        disabled
                        required />
                    <span className={styles.form_bottom_valuehint}>{translations.publish.valuehint_name}</span>
                </div>
                <div className={styles.form_row}>
                <p className={styles.form_input_title}>{translations.publish.email}</p>
                    <input
                        value={userData.email}
                        type='text'
                        className={styles.form_bottom_text_input}
                        disabled
                        required />
                    <span className={styles.form_bottom_valuehint}>{translations.publish.valuehint_email}</span>
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.phonenumber}</p>
                    <input
                        value={userData.phonenumber}
                        type='text'
                        className={styles.form_bottom_text_input}
                        disabled
                        required />
                    <span className={styles.form_bottom_valuehint}>{translations.publish.valuehint_phonenumber}</span>
                </div>
            </div> 
            <button value='submit' className={styles.submit}>{translations.publish.next}</button>   
            </form>
        </div>
    )
}