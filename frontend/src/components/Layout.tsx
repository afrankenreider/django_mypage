import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ErrorBoundary from './ErrorBoundary'
import LoadingFallback from './LoadingFallback'
import { usePageTitle } from '../hooks/usePageTitle'
import { usePageTracking } from '../hooks/usePageTracking'

export default function Layout() {
  // Order matters: the page view reads the title set just before it.
  usePageTitle()
  usePageTracking()

  return (
    <div className="flex min-h-dvh flex-col bg-page text-ink">
      <a href="#main" className="skip-link visually-hidden">
        Skip to main content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-grow">
        <ErrorBoundary>
          {/* Suspend inside the shell so the header and footer stay put while a route loads. */}
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
