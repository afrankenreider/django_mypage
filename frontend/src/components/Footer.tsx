import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="font-display font-bold text-xl mb-2">Andrew Frankenreider</h3>
            <p className="text-forest-300">Data Science Manager & Data Scientist</p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/in/andrew-frankenreider-934581b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-300 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
            <a
              href="https://github.com/afrankenreider"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-300 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href="mailto:afrankenreider@gmail.com"
              className="text-forest-300 hover:text-white transition-colors"
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-forest-700 text-center text-forest-400 text-sm">
          <p>© {new Date().getFullYear()} Andrew Frankenreider. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
