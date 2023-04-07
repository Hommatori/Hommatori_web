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
    
    return(
        <>{ data.map(item => {
            return <div className={styles.singleAd} key={item.adid}>
                {
                    item.image  != null ?
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
                    <div className={styles.singleAdDataLeft}>
                        <div>{item.header}</div>
                        <div>{item.price} €</div>
                        <div>{item.description}</div>
                    </div>
                    <div className={styles.singleAdDataRight}>
                        { getDate(item.date) }
                    </div>
                </div>
            </div>
        })}</>
    )
}