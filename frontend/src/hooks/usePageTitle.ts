import { useEffect } from 'react'

const SITE_NAME = 'Andrew Frankenreider'

/**
 * Sets a unique document title for the current route. Pass no title on the
 * home page to use the site name alone.
 */
export const usePageTitle = (title?: string): void => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  }, [title])
}
