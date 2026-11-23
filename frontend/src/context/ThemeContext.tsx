import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  /** The scheme currently rendered: the stored override, else the system preference. */
  theme: Theme
  toggleTheme: () => void
}

const STORAGE_KEY = 'color-scheme'
const SYSTEM_SCHEME = 'light dark'
const DARK_QUERY = '(prefers-color-scheme: dark)'
const PAGE_BACKGROUND: Record<Theme, string> = { light: '#f1f4ee', dark: '#0d1410' }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function readOverride(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

function writeOverride(override: Theme | null): void {
  try {
    if (override) {
      localStorage.setItem(STORAGE_KEY, override)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Storage blocked: the override still applies for this page view.
  }
}

function systemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * Two-state color scheme control. With no stored value the site follows the
 * system preference. The override is reflected in <meta name="color-scheme">,
 * which index.css maps back onto the color-scheme property, so CSS never
 * depends on a JS-applied class.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<Theme | null>(readOverride)
  const [system, setSystem] = useState<Theme>(systemTheme)
  const theme = override ?? system

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY)
    const handleSystemChange = () => setSystem(query.matches ? 'dark' : 'light')
    // Another tab may change or clear the override.
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setOverride(readOverride())
    }

    query.addEventListener('change', handleSystemChange)
    window.addEventListener('storage', handleStorage)
    return () => {
      query.removeEventListener('change', handleSystemChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  useEffect(() => {
    document
      .querySelector('meta[name="color-scheme"]')
      ?.setAttribute('content', override ?? SYSTEM_SCHEME)

    // Browser UI color: pinned while overridden, per system preference otherwise.
    document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
      const metaTheme: Theme = meta.media.includes('dark') ? 'dark' : 'light'
      meta.content = PAGE_BACKGROUND[override ?? metaTheme]
    })
  }, [override])

  const toggleTheme = useCallback(() => {
    // Target the opposite of what is on screen. If that matches the system
    // preference the user is undoing their adjustment, so clear the override
    // instead of pinning it.
    const target: Theme = theme === 'dark' ? 'light' : 'dark'
    const next = target === system ? null : target
    writeOverride(next)
    setOverride(next)
  }, [theme, system])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
