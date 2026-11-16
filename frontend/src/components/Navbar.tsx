import { useEffect, useLayoutEffect, useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { useTheme } from '../context/ThemeContext'

const MENU_ID = 'site-menu'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Skills', path: '/skills' },
  { name: 'Projects', path: '/projects' },
  { name: 'Media', path: '/weekly-media' },
]

// Popover attributes are newer than this project's React typings.
const popoverTrigger = {
  popovertarget: MENU_ID,
  popovertargetaction: 'toggle',
} as HTMLAttributes<HTMLButtonElement>
const popoverMenu = { popover: 'auto' } as HTMLAttributes<HTMLUListElement>

function isPopoverOpen(element: HTMLElement): boolean {
  try {
    return element.matches(':popover-open')
  } catch {
    // Polyfilled browsers expose the open state as a class instead.
    return element.classList.contains(':popover-open')
  }
}

function isCurrent(pathname: string, path: string): boolean {
  return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
}

/**
 * Site header with one navigation list at every width. The list is a native
 * popover while collapsed and an inline row when it fits. There is no
 * breakpoint: the row is measured, so longer labels or larger text move the
 * switch point on their own.
 */
export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const { pathname } = useLocation()
  const { toggleTheme } = useTheme()

  useLayoutEffect(() => {
    const header = headerRef.current
    const inner = innerRef.current
    const menu = menuRef.current
    if (!header || !inner || !menu) return

    let lastWidth = 0
    let frame = 0

    const syncLayout = () => {
      const width = header.clientWidth
      const wasWide = header.classList.contains('is-wide')
      // While collapsed, only remeasure when there is more room than before.
      if (!wasWide && lastWidth !== 0 && width <= lastWidth) return
      lastWidth = width

      const wasOpen = menu.hasAttribute('popover') && isPopoverOpen(menu)

      header.classList.add('is-measuring', 'is-wide')
      const fits = inner.scrollWidth <= inner.clientWidth
      header.classList.toggle('is-wide', fits)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => header.classList.remove('is-measuring'))

      if (fits) {
        menu.removeAttribute('popover')
      } else if (!menu.hasAttribute('popover')) {
        menu.setAttribute('popover', 'auto')
      }
      if (!fits && wasOpen && !isPopoverOpen(menu)) menu.showPopover()
    }

    syncLayout()
    const observer = new ResizeObserver(syncLayout)
    observer.observe(header)
    observer.observe(menu)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  // Close the collapsed menu after navigating.
  useEffect(() => {
    const menu = menuRef.current
    if (menu?.hasAttribute('popover') && isPopoverOpen(menu)) menu.hidePopover()
  }, [pathname])

  return (
    <header ref={headerRef} className="site-header">
      <div className="site-header-bar">
        <div ref={innerRef} className="apple-section site-header-inner">
          <Link to="/" className="py-2 text-sm font-semibold tracking-tight">
            Andrew Frankenreider
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <button
              type="button"
              className="icon-button site-menu-button"
              aria-controls={MENU_ID}
              {...popoverTrigger}
            >
              <MenuIcon aria-hidden="true" sx={{ fontSize: 20 }} />
              <span className="visually-hidden">Menu</span>
            </button>

            <ul ref={menuRef} id={MENU_ID} className="site-menu" {...popoverMenu}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-current={isCurrent(pathname, item.path) ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Both labels stay in the markup; CSS shows the one for the rendered scheme. */}
          <button type="button" onClick={toggleTheme} className="icon-button">
            <span className="contents dark:hidden">
              <DarkModeIcon aria-hidden="true" sx={{ fontSize: 18 }} />
              <span className="visually-hidden">Switch to dark theme</span>
            </span>
            <span className="hidden dark:contents">
              <LightModeIcon aria-hidden="true" sx={{ fontSize: 18 }} />
              <span className="visually-hidden">Switch to light theme</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
