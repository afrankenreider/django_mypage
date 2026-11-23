import { Link } from 'react-router-dom'
import Ridgeline from './Ridgeline'
import SocialLinks from './SocialLinks'

const footerLinks = [
  { name: 'About', path: '/about' },
  { name: 'Skills', path: '/skills' },
  { name: 'Projects', path: '/projects' },
  { name: 'Weekly Media', path: '/weekly-media' },
]

export default function Footer() {
  return (
    <footer className="bg-page">
      <Ridgeline className="block h-16 w-full sm:h-24 lg:h-28" />
      <div className="ink-band -mt-px">
        <div className="apple-section pb-10 pt-8 text-center">
          <Link to="/" className="wordmark text-xl">
            Andrew Frankenreider
          </Link>
          <p className="apple-copy mt-3 text-sm">Senior Manager, Digital Architecture at Caterpillar</p>
          <SocialLinks className="mt-7 justify-center" />

          <nav aria-label="Footer" className="mt-8 border-t-2 border-dotted border-[var(--sand-line)] pt-6">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-1">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="inline-flex min-h-11 items-center text-xs font-medium uppercase tracking-[0.22em] text-muted transition-colors hover:text-ink"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} Andrew Frankenreider</p>
            <p>Built with React, TypeScript, and Django.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
