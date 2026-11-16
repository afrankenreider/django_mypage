import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Andrew Frankenreider'

const ROUTE_TITLES: Record<string, string> = {
  '/about': 'About',
  '/skills': 'Skills',
  '/projects': 'Projects',
  '/projects/linear-regression': 'Linear regression',
  '/projects/kmeans': 'K-means clustering',
  '/projects/neural-networks': 'Neural networks',
  '/projects/finance-dashboard': 'Finance dashboard',
  '/weekly-media': 'Weekly media',
}

/**
 * Gives every route a unique document title. Titles come from the path
 * rather than from the page components, so the title is already correct
 * while a lazy-loaded page is still downloading.
 */
export const usePageTitle = (): void => {
  const { pathname } = useLocation()

  useEffect(() => {
    const title = ROUTE_TITLES[pathname.replace(/\/+$/, '')]
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  }, [pathname])
}
