import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import PsychologyIcon from '@mui/icons-material/Psychology'
import CodeIcon from '@mui/icons-material/Code'
import StorageIcon from '@mui/icons-material/Storage'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white/80 dark:bg-slate-950/80">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh" />

        {/* Animated gradient orbs - monochromatic */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-slate-400/20 to-slate-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-300/15 to-slate-500/15 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >

            {/* Main headline */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Andrew Frankenreider</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-light mb-8 max-w-3xl mx-auto"
            >
              Advanced Analytics & Data Science Manager
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              I build intelligent systems and beautiful interfaces that transform
              complex data into actionable insights. Currently leading data science
              for the Earthmoving Division at <span className="text-slate-700 dark:text-slate-300 font-medium">Caterpillar, Inc</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16"
            >
              <Link
                to="/projects"
                className="group btn-primary inline-flex items-center gap-2"
              >
                View My Work
                <ArrowForwardIcon className="group-hover:translate-x-1 transition-transform" sx={{ fontSize: 20 }} />
              </Link>
              <Link
                to="/about"
                className="btn-secondary"
              >
                About Me
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex justify-center items-center gap-4"
            >
              {[
                { icon: <LinkedInIcon />, href: "https://www.linkedin.com/in/andrew-frankenreider-934581b1/", label: "LinkedIn" },
                { icon: <GitHubIcon />, href: "https://github.com/afrankenreider", label: "GitHub" },
                { icon: <EmailIcon />, href: "mailto:afrankenreider@gmail.com", label: "Email" },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.href}
                  target={social.href.startsWith('mailto') ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200/50 dark:border-slate-700/50"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator - positioned relative to section, not content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-slate-400 dark:text-slate-600"
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 32 }} />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              What I Do Best
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Combining technical expertise with strategic thinking to deliver impactful solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Machine Learning",
                description: "Building predictive models and AI systems that drive business decisions and automate complex processes.",
                icon: <PsychologyIcon sx={{ fontSize: 28 }} />,
              },
              {
                title: "Full-Stack Development",
                description: "Creating elegant web applications with modern frameworks, from responsive frontends to scalable APIs.",
                icon: <CodeIcon sx={{ fontSize: 28 }} />,
              },
              {
                title: "Data Engineering",
                description: "Designing robust data pipelines and architectures that transform raw data into valuable insights.",
                icon: <StorageIcon sx={{ fontSize: 28 }} />,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="h-full p-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center mb-6 shadow-lg text-white dark:text-slate-900">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-50" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to explore?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
              Check out my interactive data science tutorials and see machine learning concepts come to life.
            </p>
            <Link
              to="/projects"
              className="group btn-primary inline-flex items-center gap-2 text-lg"
            >
              Explore Projects
              <ArrowForwardIcon className="group-hover:translate-x-1 transition-transform" sx={{ fontSize: 22 }} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
