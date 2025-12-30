import { motion } from 'framer-motion'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import { Link } from 'react-router-dom'

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Skills', path: '/skills' },
  { name: 'Projects', path: '/projects' },
]

const socialLinks = [
  { icon: <LinkedInIcon sx={{ fontSize: 20 }} />, href: "https://www.linkedin.com/in/andrew-frankenreider-934581b1/", label: "LinkedIn" },
  { icon: <GitHubIcon sx={{ fontSize: 20 }} />, href: "https://github.com/afrankenreider", label: "GitHub" },
  { icon: <EmailIcon sx={{ fontSize: 20 }} />, href: "mailto:afrankenreider@gmail.com", label: "Email" },
]

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 flex items-center justify-center">
                  <span className="font-display font-bold text-white dark:text-slate-900 text-lg">A</span>
                </div>
                <span className="font-display font-semibold text-xl text-slate-900 dark:text-white">
                  Andrew Frankenreider
                </span>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-6">
                Advanced Analytics & Data Science Manager passionate about building intelligent systems
                and creating beautiful, functional interfaces.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={social.href}
                    target={social.href.startsWith('mailto') ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm hover:shadow-md border border-slate-200/50 dark:border-slate-700/50"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {footerLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Get in Touch</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:afrankenreider@gmail.com"
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    afrankenreider@gmail.com
                  </a>
                </li>
                <li className="text-slate-600 dark:text-slate-400">
                  Chicago, IL
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} Andrew Frankenreider. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Built with React, TypeScript & Django
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
