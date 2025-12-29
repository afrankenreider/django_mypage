import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import TerminalIcon from '@mui/icons-material/Terminal'
import DataObjectIcon from '@mui/icons-material/DataObject'

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 bg-slate-50 dark:bg-black">
      {/* Subtle grid overlay for tech effect */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(100, 116, 139, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.5) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Floating code snippets for visual interest */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-32 left-10 text-slate-400 dark:text-slate-500 font-mono text-sm hidden lg:block"
      >
        <pre>{`def predict(model, data):
    return model.fit(data)`}</pre>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-32 right-10 text-slate-400 dark:text-slate-500 font-mono text-sm hidden lg:block"
      >
        <pre>{`import pandas as pd
df = pd.DataFrame()`}</pre>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Terminal-style header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-300 dark:border-slate-700 mb-6"
          >
            <TerminalIcon className="text-slate-600 dark:text-slate-400" sx={{ fontSize: 18 }} />
            <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">~/data-science</span>
            <span className="text-slate-400 dark:text-slate-500 font-mono text-sm">$</span>
            <span className="text-slate-800 dark:text-white font-mono text-sm">whoami</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
            Andrew Frankenreider
          </h1>

          <h2 className="text-2xl md:text-3xl font-medium mb-8 text-slate-600 dark:text-slate-300">
            <DataObjectIcon className="inline mr-2" sx={{ fontSize: 28 }} />
            Advanced Analytics & Data Science Manager
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Leveraging cutting-edge technology to build data products that drive business value.
            Passionate about <span className="text-slate-900 dark:text-white font-semibold">machine learning</span>, <span className="text-slate-900 dark:text-white font-semibold"> software development,</span>
            <span className="text-slate-900 dark:text-white font-semibold"> automation</span>, and creating
            elegant solutions to complex problems.
          </p>

          {/* Social Links */}
          <div className="flex justify-center items-center space-x-6 mb-12">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.linkedin.com/in/andrew-frankenreider-934581b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700"
            >
              <LinkedInIcon />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/afrankenreider"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700"
            >
              <GitHubIcon />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:afrankenreider@gmail.com"
              className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-lg hover:shadow-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700"
            >
              <EmailIcon />
            </motion.a>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/about"
              className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-full hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg"
            >
              Learn More About Me
            </Link>
            <Link
              to="/projects"
              className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-lg border border-slate-200 dark:border-slate-700"
            >
              View Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
