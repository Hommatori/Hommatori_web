'use client'

import styles from '../styles/page-nav-btns.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'

// this is the single page nav link container of the search page. It displays previous / next result page links as well as links to individual result pages
export default function ResultNavContainer({ total_rows, maxResultsToDisplay, page }) {

  const router = useRouter()
  const { query } = router
  const containerRef = useRef() // store individual page link container reference using useRef - used to get width of the container to calculate how many links can be rendered inside
  const [navBtnContainerWidth, setNavBtnContainerWidth] = useState(null) // width of the container that includes individual page navigation links, used to dynamically adjust the amount of links
  const [startIndex, setStartIndex] = useState(0) // index of the first rendered link in the pageNuymbers array
  const [endIndex, setEndIndex] = useState(5) // index of the last rendered link in the pageNumbers array
  const pageNumbers = Array.from({ length: Math.ceil(total_rows / maxResultsToDisplay) }, (_, i) => i + 1) // create an array that contains all necessary pages that ad data from server are stored to
  const buttonWidth = 70 // width of an indivdual page button in the page navigation div

  // modify the query parameter as needed - these consts are used by the previous & next page links
  const previousPage = page - 1
  const nextPage = page + 1
  const previousPageQuery = { ...query, p: previousPage }
  const nextPageQuery = { ...query, p: nextPage }

  // form the href for the previous page / next page link
  const previousPageHref = { pathname: router.pathname, query: previousPageQuery }
  const nextPageHref = { pathname: router.pathname, query: nextPageQuery }

  // get link to a single page - used with single page links that are created dynamically
  function getSinglePageLink(page) {
    const newQuery = { ...query, p: page } 
    return { pathname: router.pathname, query: newQuery }
  }

  useEffect(() => {
    if (containerRef.current) { // if containerRef has current element
      setNavBtnContainerWidth(containerRef.current.offsetWidth) // set page link container width to component state
      const getWidth = () => { // window event listener calls this on window resize
          setNavBtnContainerWidth(containerRef.current.offsetWidth) // update page link container width to component state if window and the container accordinly is resized
      }
      window.addEventListener("resize", getWidth) // add event listener to window and call getWidth on window resize
      return () => window.removeEventListener("resize", getWidth) // event listener cleanup
    }
  }, [])

  useEffect(() => {
    if (navBtnContainerWidth) { // if individual page link container has width stored in component state..
      const maxButtons = Math.floor(navBtnContainerWidth / buttonWidth) // calculate amount of buttons that fit the page link container
      const totalPages = pageNumbers.length // get total amount of pages from the length of the pageNumbers list

      // calculate start (first page link to display) and end (last page link to display) indexes -> basically what links to display..
      // ..depending on how many links fit the container, how many pages there are in total and what is the current page
      if (totalPages <= maxButtons) { // if there are fewer pages than the maximum number of buttons that can be displayed
        // show all pages
        setStartIndex(0)
        setEndIndex(totalPages - 1)
      } else if (page <= maxButtons / 2) { // if the current page is close to the beginning of the range
        // show the first maxButtons pages
        setStartIndex(0);
        setEndIndex(maxButtons - 1)
      } else if (page > totalPages - maxButtons / 2) { // if the current page is close to the end of the range
        // show the last maxButtons pages
        setStartIndex(totalPages - maxButtons)
        setEndIndex(totalPages - 1)
      } else { // otherwise, the current page is in the middle of the range
        // show a range of maxButtons pages centered around the current page
        setStartIndex(page - Math.floor(maxButtons / 2) - 1)
        setEndIndex(page + Math.floor(maxButtons / 2) - 1)
      }
    }
  }, [page, navBtnContainerWidth, pageNumbers])

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
      <div className={styles.pageNavigationContainer} ref={containerRef}>
        { 
          pageNumbers.slice(startIndex, endIndex + 1).map((pageNumber, index) => {
              return <Link className={page == pageNumber ? styles.pageNavigationItemActive : styles.pageNavigationItem}
                            key={index}
                            href={getSinglePageLink(pageNumber)}>{pageNumber}</Link>
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
