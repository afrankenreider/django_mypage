import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LaunchIcon from '@mui/icons-material/Launch'
import FolderIcon from '@mui/icons-material/Folder'
import TimelineIcon from '@mui/icons-material/Timeline'

interface Project {
  id: number
  title: string
  description: string
  technology: string
  link: string
  icon: React.ReactNode
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Linear Regression Demo',
    description: 'A comprehensive, interactive tutorial on linear regression. Learn the fundamentals of this essential machine learning algorithm through beautiful visualizations and hands-on experimentation.',
    technology: 'Machine Learning',
    link: '/projects/linear-regression',
    icon: <TimelineIcon sx={{ fontSize: 48 }} />,
  },
]

const techColors: Record<string, string> = {
  'Machine Learning': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Python: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  API: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  Automation: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
}

export default function Projects() {
  return (
    <section className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-300 dark:border-slate-700 mb-4">
              <FolderIcon className="text-slate-600 dark:text-slate-400" sx={{ fontSize: 18 }} />
              <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">~/projects</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Projects
            </h1>
            <div className="w-24 h-1 bg-slate-900 dark:bg-white mx-auto rounded-full mb-6" />
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Interactive demos and tutorials showcasing data science concepts and techniques
            </p>
          </div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              >
                {/* Project Icon */}
                <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden flex items-center justify-center">
                  <div className="text-slate-400 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-500 transition-colors group-hover:scale-110 duration-300">
                    {project.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 to-transparent" />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${techColors[project.technology] || 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                      {project.technology}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <Link
                    to={project.link}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    Explore Demo
                    <LaunchIcon sx={{ fontSize: 16 }} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">More demos coming soon...</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
