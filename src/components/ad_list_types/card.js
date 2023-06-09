import Head from 'next/head'
import styles from '../../styles/ad-card.module.css'
import Link from 'next/link'

export default function Card({ data, translations }) {

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
        <div className={styles.cardWrapper}>
            { data.map(item => {
                return <Link
                            className={styles.singleAd}
                            key={item.adid}
                            href={`/ad/${item.adid}/${item.header}`}>                 
                    <div className={styles.singleAdData}>
                        <div className={styles.singleAdDataTop}>
                            <h3 className={styles.header}>{item.header}</h3>                            
                            <p className={styles.description}>{item.description}</p>
                        </div>
                        <div className={styles.singleAdDataBottom}>
                            <div className={styles.price}>{item.price} €</div>
                            { getDate(item.date) }
                        </div>
                    </div>
                </Link>
            })}
        </div>
    )
}
