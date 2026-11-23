import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import ScrollToTop from './components/ScrollToTop'
import '@fontsource/libre-caslon-display/latin-400.css'
import './index.css'

// Popover is not yet in every supported browser: load the polyfill only where it is missing.
if (!Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover')) {
  import('@oddbird/popover-polyfill')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ScrollToTop />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
