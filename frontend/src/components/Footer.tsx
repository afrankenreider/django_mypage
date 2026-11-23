import { Link } from 'react-router-dom'
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
      <div className="apple-section py-12">
        <div className="soft-rule mb-8" />
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Link to="/" className="text-lg font-semibold tracking-tight">
              Andrew Frankenreider
            </Link>
            <p className="apple-copy mt-3 max-w-md text-sm">
              Senior Manager, Digital Architecture at Caterpillar.
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="text-sm font-semibold">Explore</h2>
            <ul className="mt-3">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="inline-flex items-center py-1 text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Contact</h2>
            <SocialLinks className="mt-4" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Andrew Frankenreider. All rights reserved.</p>
          <p>Built with React, TypeScript, and Django.</p>
        </div>
      </div>
    </footer>
  )
}
