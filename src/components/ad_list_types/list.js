import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/ad-list.module.css'

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

    let x = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    
    return(
        <>{ data.map((item, index) => {
            return <div className={index == 0 ? styles.firstSingleAd : styles.singleAd} key={item.adid}>
                {
                     item.image != null && item.image.length != 0 ?
                    <Image
                        width={250}
                        className={styles.singleAdImage}
                        src={item.image ? item.image : ""}
                        height={37}
                        alt="hommatori"
                        as="image"
                    /> : <></>
                }
                
                <div className={styles.singleAdData}>
                    <div className={styles.singleAdDataTop}>
                        <div className={styles.header}>{item.header}</div>                        
                        <div className={styles.description}>{item.description}</div>
                    </div>
                    <div className={styles.singleAdDataBottom}>
                        <div className={styles.price}>{item.price} €</div>
                        {item.region}, {item.municipality} { getDate(item.date) }
                    </div>
                </div>
            </div>
        })}</>
    )
}