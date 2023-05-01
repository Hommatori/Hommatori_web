import React from 'react'
import styles from '../../styles/form-success.module.css'
import Link from 'next/link'


//This is part 3/3 of the multiphase ad upload form
export default function AdDetails ({ translations, adid, fname }) {
    const linkToNewAd = adid ? `ad/${adid}` : '/notfound'


    return (
        <div>
            <h3>{translations.publish.great} {fname}! {translations.publish.is_published}!</h3>
            <p className={styles.text}>{translations.publish.find_ad_here} <Link className={styles.adLink} href={linkToNewAd}>
                {translations.publish.here}
            </Link>.</p>
        </div>
    )
}