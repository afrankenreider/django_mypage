import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
    }
}

/**
 * Custom hook to track page views in Google Analytics for SPA navigation.
 * Fires a page_view event whenever the route changes.
 */
export const usePageTracking = (): void => {
    const location = useLocation();

    useEffect(() => {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'page_view', {
                page_path: location.pathname + location.search,
                page_title: document.title,
            });
        }
    }, [location]);
};
