import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="font-display font-bold text-xl mb-2">Andrew Frankenreider</h3>
            <p className="text-slate-400">Data Science Manager & Data Scientist</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://www.linkedin.com/in/andrew-frankenreider-934581b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://github.com/afrankenreider"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
            <a
              href="mailto:afrankenreider@gmail.com"
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Andrew Frankenreider. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
