import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
    const { pathname } = useLocation()
    const isFirstRender = useRef(true)

    useLayoutEffect(() => {
        // Skip scroll on initial mount to avoid flash
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        // Use requestAnimationFrame to batch with browser paint cycle
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        })
    }, [pathname])

    return null
}
