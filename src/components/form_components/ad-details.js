import React, { useEffect } from 'react'
import styles from '../../styles/form-details.module.css'
import regions from '../../json/regions'

//This is part 1/4 of the multiphase signup form
export default function AdDetails ({
    nextStep,
    values,
    setType,
    setRegion,
    setMunicipality,
    setHeader,
    setDescription,
    setPrice,
    setImage,
    userData,
    translations
}) {

    function handleRegionChange(e) {
        setRegion(e.target.value)
        document.getElementById('select_municipality').selectedIndex = -1;
    }

    return (
    <main className={styles.main}>
        <div className={styles.editContent}>
            <form className={styles.editForm} onSubmit={ (e) => nextStep(e) }>

                <div className={styles.form_top}>
                    <div className={styles.form_wrapper_title}>{translations.publish.type_and_location}</div>
                    <div className={styles.form_row}>
                        <p className={styles.form_input_title}>{translations.publish.region}</p>
                        <select className={styles.form_dropdown} onChange={handleRegionChange}>
                            <option value={null}>{translations.homepage.region_entire_finland}</option>
                            {
                                Object.keys(regions).map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })  
                            }
                        </select>
                    </div>
                    <div className={styles.form_row}>
                        <p className={styles.form_input_title}>{translations.publish.municipality}</p>
                        <select className={styles.form_dropdown} onChange={(e) => setMunicipality(e.target.value)} id='select_municipality'>
                            <option value={null}>{translations.homepage.region_entire_finland}</option>
                            {
                                regions[values.region]?.map((item, index) => {
                                    return <option key={index} value={item}>{item}</option>
                                })  
                            }
                        </select>
                    </div>
                    <div className={styles.form_row}>
                        <p className={styles.form_input_title}>{translations.publish.type}</p>
                        <input
                            type="radio"
                            name="type"
                            className={styles.form_radioBtn}
                            onChange={(e) => setType(e.target.value)}
                            defaultChecked />
                        <label>1</label>
                        <input
                            type="radio"
                            name="type"
                            className={styles.form_radioBtn}
                            onChange={(e) => setType(e.target.value)} />
                        <label>2</label>
                    </div>
                </div>   

            <div className={styles.form_middle}>
                <div className={styles.form_wrapper_title}>{translations.publish.info}</div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.title}</p>
                    <input
                        type="text"
                        className={styles.form_text_input}
                        onChange={(e) => setHeader(e.target.value)}
                        autoComplete="off"
                        maxLength="50"
                        required />
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.description}</p>
                    <textarea
                        type="text"
                        className={styles.form_textarea_description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength="600"
                        required />
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.price}</p>
                    <input
                        type="text"
                        className={styles.form_text_input}
                        onChange={(e) => setPrice(e.target.value)}
                        autoComplete="off"
                        required />
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.image}</p>
                    <input
                        className={styles.form_dropdown}
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        autoComplete="off"
                        accept=".png, .jpg, .jpeg" />
                    <button onClick={() => {setImage(null)}}>{translations.publish.remove_photos}</button>    
                </div>
            </div>

            <div className={styles.form_bottom}>
                <div className={styles.form_wrapper_title}>{translations.publish.contact_info}</div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.name}</p>
                    <input
                        type="text"
                        className={styles.form_text_input}
                        disabled
                        required />
                </div>
                <div className={styles.form_row}>
                <p className={styles.form_input_title}>{translations.publish.email}</p>
                    <input
                        type="text"
                        className={styles.form_text_input}
                        disabled
                        required />
                </div>
                <div className={styles.form_row}>
                    <p className={styles.form_input_title}>{translations.publish.phonenumber}</p>
                    <input
                        type="text"
                        className={styles.form_text_input}
                        disabled
                        required />  
                </div>
            </div> 
            <button value="submit" className={styles.submit}>{translations.publish.next}</button>   
            </form>
        </div>
    </main>
    )
}