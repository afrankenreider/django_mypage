import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll and moves focus to the main landmark after a client-side
 * navigation, so keyboard and screen reader users start at the new page
 * instead of wherever the previous page left them.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation()
    const previousPathname = useRef(pathname)

    useLayoutEffect(() => {
        // Only act on an actual route change, not the initial load.
        if (previousPathname.current === pathname) return
        previousPathname.current = pathname

        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        document.getElementById('main')?.focus({ preventScroll: true })
    }, [pathname])

    return null
}
