import React, { useEffect } from 'react'
import styles from '../../styles/form-confirmation.module.css'
import Image from 'next/image'

//This is part 2/3 of the multiphase ad upload form
export default function Confirmation({ translations, prevStep,  values, userData, submit }) {

    useEffect(() => { //automatically scrolls to the top of the page, useful for mobile userss
        window.scrollTo(0, 0)
    }, [])

    function goBack(e) {
        e.preventDefault()
        prevStep()
    }

    return (
        <>
        <p>{translations.publish.validate_data}</p>
        <div className={styles.confirm_form}>
            <div className={styles.form_top}>
                <div className={styles.form_wrapper_title}>{translations.publish.type_and_location}</div>
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.region}</p>
                    <p className={styles.form_confirm_value}>{values.region}</p>
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.municipality}</p>
                    <p className={styles.form_confirm_value}>{values.municipality}</p>
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.type}</p>
                    <p className={styles.form_confirm_value}>
                        {values.type === 'jobseeker' ? translations.publish.jobseeker : translations.publish.joboffer}
                    </p>
                </div>
            </div>   

            <div className={styles.form_middle}>
                <div className={styles.form_wrapper_title}>{translations.publish.info}</div>
                { values.images[0] ? <div className={styles.form_row_images}>
                    <p className={styles.form_confirm_title}>{translations.publish.images}</p>
                    { values.images.map((image, index) => {
                        if (image) { return (
                            <div className={styles.preview_image_wrapper}>
                                <p className={styles.image_title}>{translations.publish.one_image} {index + 1}</p>
                                <div key={index} className={styles.preview_image_container}>
                                    <Image
                                        src={URL.createObjectURL(image)}
                                        alt={`Uploaded ${index + 1}`}
                                        fill
                                        style={{ objectFit: 'cover' }}   />
                                </div>
                            </div>
                        )} else { return null }
                    })}
                </div> : <></> }
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.title}</p>
                    <p className={styles.form_confirm_value}>{values.header}</p>
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.description}</p>
                    <p className={styles.form_confirm_value}>{values.description}</p>
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.price}</p>
                    <p className={styles.form_confirm_value}>{values.price} €</p>
                </div>
            </div>

            <div className={styles.form_bottom}>
                <div className={styles.form_wrapper_title}>{translations.publish.contact_info}</div>
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.name}</p>
                    <p className={styles.form_confirm_value}>{userData.fname + ' ' + userData.lname}</p>
                </div>
                <div className={styles.form_row}>
                <p className={styles.form_confirm_title}>{translations.publish.email}</p>
                <p className={styles.form_confirm_value}>{userData.email}</p>
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_confirm_title}>{translations.publish.phonenumber}</p>
                    <p className={styles.form_confirm_value}>{userData.phonenumber}</p>
                </div>
            </div>
            <div className={styles.bottom_btn_row}>
                <button className={styles.goBack} onClick={(e) => goBack(e)}>{translations.publish.edit}</button>
                <button className={styles.publishBtn} onClick={(e) => submit(e)}>{translations.publish.publish}</button>
            </div>
        </div>        
        </>
    )
}