'use client'

import styles from '../styles/page-nav-btns.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

// this is the footer of the website. It receives language translations as props
export default function NavBtn({ total_rows, maxResultsToDisplay, page }) {

    const router = useRouter()
    const { query } = router
    const containerRef = useRef() // store container reference using useRef
    const [navBtnContainerWidth, setNavBtnContainerWidth] = useState(null)    
    const [maxButtons, setMaxButtons] = useState(0)
    const [startIndex, setStartIndex] = useState(0)
    const [endIndex, setEndIndex] = useState(0)
    const arrayLength = Math.ceil(total_rows / maxResultsToDisplay)
    const pageNumbers = Array.from({ length: arrayLength }, (_, i) => i + 1)
    const buttonWidth = 70
    

    // modify the query parameter as needed
    const previousPage = page - 1
    const nextPage = page + 1
    const previousPageQuery = { ...query, p: previousPage }
    const nextPageQuery = { ...query, p: nextPage }

    // form the href for the link
    const previousPageHref = {
        pathname: router.pathname,
        query: previousPageQuery,
    }
    const nextPageHref = {
        pathname: router.pathname,
        query: nextPageQuery,
    }

    // get link to a single page
    function getSinglePageLink(page) {
        const newPage = page
        const newQuery = { ...query, p: newPage } 
        return { pathname: router.pathname, query: newQuery}
    }

    useEffect(() => {
        containerRef.current && setNavBtnContainerWidth(containerRef.current.offsetWidth) // when the component gets mounted
         // getWidth handles updating containerRef width to component state
        const getWidth = ()=> {
            setNavBtnContainerWidth(containerRef.current.offsetWidth)
        }
        containerRef.current && window.addEventListener("resize", getWidth) // add event listener to window adn execute getWidth when window is resized
        return () =>  window.removeEventListener("resize", getWidth) // remove the event listener before component unmounts
    }, [containerRef])

    useEffect(() => {
        setMaxButtons(Math.floor(navBtnContainerWidth / buttonWidth))
        // Calculate the start and end indexes based on the current page
        if (pageNumbers.length <= maxButtons) {
            setStartIndex(0);
            setEndIndex(pageNumbers.length - 1);
        } else if (page <= maxButtons / 2) {
            setStartIndex(0);
            setEndIndex(maxButtons - 1);
        } else if (page > pageNumbers.length - maxButtons / 2) {
            setEndIndex(pageNumbers.length - 1);
            setStartIndex(pageNumbers.length - maxButtons);
        } else {
            setStartIndex(page - Math.floor(maxButtons / 2) - 1);
            setEndIndex(page + Math.floor(maxButtons / 2) - 1);
        }
    }, [router, navBtnContainerWidth, startIndex, endIndex])

    return(
        <div className={styles.pageNavigator}>
            {
                page > 1 ?
                <Link className={styles.navigationLink} href={previousPageHref}>edellinen</Link>
                : <div className={styles.navigationLinkDisabled}>edellinen</div>
            }
            {
                page > 1 ?
                <Link className={styles.navigationLinkMobile} href={previousPageHref}>&lt;</Link>
                : <div className={styles.navigationLinkDisabledMobile}>&lt;</div>
            }
            <div className={styles.pageNavigationItemWrapper} ref={containerRef}>
                { 
                    pageNumbers.slice(startIndex, endIndex + 1).map((pageNumber, index) => {
                        return <Link className={styles.pageNavigationItem} key={index} href={getSinglePageLink(pageNumber)}>{pageNumber}</Link>
                    })
                }
            </div>
            {
                page < Math.ceil(total_rows / maxResultsToDisplay) ?
                <Link className={styles.navigationLink} href={nextPageHref}>seuraava</Link>
                : <div className={styles.navigationLinkDisabled}>seuraava</div>
            }
            {
                page < Math.ceil(total_rows / maxResultsToDisplay) ?
                <Link className={styles.navigationLinkMobile} href={nextPageHref}>&gt;</Link>
                : <div className={styles.navigationLinkDisabledMobile}>&gt;</div>
            }             
        </div>
    )
}
