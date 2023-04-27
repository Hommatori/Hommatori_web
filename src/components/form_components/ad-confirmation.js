import React, { useEffect } from 'react'
import styles from '../../styles/form-confirmation.module.css'

//This is part 2/4 of the multiphase signup form
const Confirmation = ({ prevStep,  values }) => {

    useEffect(() => { //automatically scrolls to the top of the page, useful for mobile userss
        window.scrollTo(0, 0)
      }, []);

      //console.log(values);

    return (
        <div className="Signup">
            <div className="signupContent">
                <div className="signupTitle">Confirm details</div>
                <div className="signupSubTitle">Is this information correct?</div>
                <div className="confirmationBox">
                    <p>Email</p>
                    <div className="confirmationContainer">{values.email}</div>
                    <p>Restaurant name</p>
                    <div className="confirmationContainer">{values.name}</div>
                    <p>Address</p>
                    <div className="confirmationContainer">{values.address}</div>
                    <p>Open</p>
                    <div className="confirmationContainer">{values.open}</div>
                    <p>Type</p>
                    <div className="confirmationContainer">{values.type}</div>
                    <p>Price level</p>
                    <div className="confirmationContainer">{values.pricelevel}</div>
                    <p>Image</p>
                    <img className="confirmationImage" src={values.tempImage}/>
                </div>
                <div className="confirmationBtns">
                    <button id="confirmPrev" className="multiphaseFormBtn" onClick={ (e) => prevStep(e) }>&#11160; No, take me back</button>
                </div>
            </div>
        </div>
    )
}

export default Confirmation;