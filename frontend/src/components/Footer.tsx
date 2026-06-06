import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import { Link } from 'react-router-dom'

const footerLinks = [
  { name: 'About', path: '/about' },
  { name: 'Skills', path: '/skills' },
  { name: 'Projects', path: '/projects' },
  { name: 'Weekly Media', path: '/weekly-media' },
]

const socialLinks = [
  { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, href: 'https://www.linkedin.com/in/andrew-frankenreider-934581b1/', label: 'LinkedIn' },
  { icon: <GitHubIcon sx={{ fontSize: 18 }} />, href: 'https://github.com/afrankenreider', label: 'GitHub' },
  { icon: <EmailIcon sx={{ fontSize: 18 }} />, href: 'mailto:afrankenreider@gmail.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] dark:bg-black">
      <div className="apple-section py-12">
        <div className="soft-rule mb-8" />
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Link to="/" className="text-lg font-semibold tracking-tight">
              Andrew Frankenreider
            </Link>
            <p className="apple-copy mt-3 max-w-md text-sm">
              Analytics and data science manager building reporting platforms, automation, and machine learning tools that teams actually use.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Explore</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-[#6e6e73] transition-colors hover:text-[#1d1d1f] dark:text-[#a1a1a6] dark:hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border hairline text-[#6e6e73] transition-colors hover:bg-white hover:text-[#1d1d1f] dark:text-[#a1a1a6] dark:hover:bg-white/10 dark:hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-xs text-[#86868b] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Andrew Frankenreider. All rights reserved.</p>
          <p>Built with React, TypeScript, and Django.</p>
        </div>
      </div>
    </footer>
  )
}
