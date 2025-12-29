import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forest-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold text-forest-900 mb-6">
            Andrew Frankenreider
          </h1>

          <h2 className="text-2xl md:text-3xl font-medium mb-8">
            <span className="gradient-text">Data Science Manager</span>
            <span className="text-earth-600"> & </span>
            <span className="gradient-text">Data Scientist</span>
          </h2>

          <p className="text-lg text-earth-700 max-w-2xl mx-auto mb-12">
            Leveraging cutting-edge technology to build data products that drive business value.
            Passionate about machine learning, automation, and creating elegant solutions to complex problems.
          </p>

          {/* Social Links */}
          <div className="flex justify-center items-center space-x-6 mb-12">
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.linkedin.com/in/andrew-frankenreider-934581b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl text-forest-600 hover:text-primary-600 transition-all"
            >
              <LinkedInIcon />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/afrankenreider"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl text-forest-600 hover:text-primary-600 transition-all"
            >
              <GitHubIcon />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:afrankenreider@gmail.com"
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl text-forest-600 hover:text-primary-600 transition-all"
            >
              <EmailIcon />
            </motion.a>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/about"
              className="px-8 py-3 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Learn More About Me
            </Link>
            <Link
              to="/projects"
              className="px-8 py-3 bg-white text-forest-700 font-medium rounded-full hover:bg-earth-50 transition-colors shadow-lg hover:shadow-xl border border-earth-200"
            >
              View Projects
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 32 }} className="text-earth-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
