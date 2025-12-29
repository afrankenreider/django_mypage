import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import TerminalIcon from '@mui/icons-material/Terminal'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-slate-900 dark:text-white py-12 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <TerminalIcon className="text-slate-600 dark:text-slate-400" />
              <h3 className="font-mono font-bold text-xl text-slate-900 dark:text-white">Andrew Frankenreider</h3>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Advanced Analytics & Data Science Manager</p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/in/andrew-frankenreider-934581b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://github.com/afrankenreider"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href="mailto:afrankenreider@gmail.com"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-500 text-sm font-mono">
          <p>© {new Date().getFullYear()} Andrew Frankenreider. Built with React & Django.</p>
        </div>
      </div>
    </footer>
  )
}
