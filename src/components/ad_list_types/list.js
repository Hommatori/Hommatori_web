import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/ad-list.module.css'
import Link from 'next/link'

export default function List({ data, translations }) {

    function getDate(item_date){
        // create a new Date object with the given date string
        const date = new Date(item_date)

        // create an array of month names
        const monthNames = translations.search.list_of_months

        // get the day and month from the date object
        const day = date.getUTCDate();
        const month = monthNames[date.getUTCMonth()]

        // get the hours and minutes from the date object
        const hours = date.getUTCHours()
        const minutes = date.getUTCMinutes()

        // create the formatted date string
        const formattedDate = (day === new Date().getUTCDate() && date.getUTCMonth() === new Date().getUTCMonth()) ? 'today' : `${day} ${month}`
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

        return `${formattedDate} ${formattedTime}`
    }

    function getSingleImage(image) {
        let imageToDisplay = null
        if (image) {
            try {
                const imageArray = JSON.parse(image)
                if (Array.isArray(imageArray)) {
                    imageToDisplay = imageArray[0]          
                }
            } catch {
                imageToDisplay = image.replace(/['"\r\n]+/g, '')
            }
        }
        return imageToDisplay
    }
    
    return(
        <>{ data.map((item, index) => {
            return <Link
                        className={index == 0 ? styles.firstSingleAd : styles.singleAd}
                        key={item.adid}
                        href={`/ad/${item.adid}/${item.header}`}>
                {
                    item.image != null && JSON.parse(item.image).length != 0 ?
                    <div className={styles.singleAdImageWrapper}>
                        <Image
                            src={getSingleImage(item.image)}
                            alt='hommatori'
                            as='image'
                            fill
                            style={{ objectFit: 'fill' }}  
                        /> 
                    </div> : <></>
                }
                
                <div className={styles.singleAdData}>
                    <div className={styles.singleAdDataTop}>
                        <h3 className={styles.header}>{item.header}</h3>                        
                        <p className={styles.description}>{item.description}</p>
                    </div>
                    <div className={styles.singleAdDataBottom}>
                        <div className={styles.price}>{item.price} €</div>
                        {item.region}, {item.municipality} { getDate(item.date) }
                    </div>
                </div>
            </Link>
        })}</>
    )
}