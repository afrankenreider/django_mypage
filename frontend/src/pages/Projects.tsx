import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import TimelineIcon from '@mui/icons-material/Timeline'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import DataObjectIcon from '@mui/icons-material/DataObject'
import BubbleChartIcon from '@mui/icons-material/BubbleChart'

interface Project {
  id: number
  title: string
  description: string
  technology: string
  link: string
  icon: React.ReactNode
  comingSoon?: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Linear Regression',
    description: 'An interactive deep-dive into linear regression. Learn the fundamentals of this essential machine learning algorithm through beautiful visualizations and hands-on experimentation.',
    technology: 'Machine Learning',
    link: '/projects/linear-regression',
    icon: <TimelineIcon sx={{ fontSize: 32 }} />,
  },
  {
    id: 2,
    title: 'K-Means Clustering',
    description: 'Discover how unsupervised learning finds hidden patterns in data. Watch the algorithm iterate in real-time as it groups data points into meaningful clusters.',
    technology: 'Machine Learning',
    link: '/projects/kmeans',
    icon: <BubbleChartIcon sx={{ fontSize: 32 }} />,
  },
  {
    id: 3,
    title: 'Neural Networks',
    description: 'Explore the building blocks of deep learning. Understand how neural networks learn patterns through interactive visualizations of forward and backward propagation.',
    technology: 'Deep Learning',
    link: '/projects/neural-networks',
    icon: <AutoGraphIcon sx={{ fontSize: 32 }} />,
    comingSoon: true,
  },
  {
    id: 4,
    title: 'Data Pipelines',
    description: 'Learn how to build robust, scalable data pipelines. From ETL processes to real-time streaming, master the art of data engineering.',
    technology: 'Data Engineering',
    link: '/projects/data-pipelines',
    icon: <DataObjectIcon sx={{ fontSize: 32 }} />,
    comingSoon: true,
  },
]

export default function Projects() {
  return (
    <section className="min-h-screen pt-32 pb-24 bg-white/80 dark:bg-slate-950/80 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 mb-6"
            >
              Interactive Tutorials
            </motion.span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Explore data science concepts through interactive demos and hands-on learning experiences
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                className="group relative"
              >
                {/* Card */}
                <div className={`h-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden transition-all duration-500 ${!project.comingSoon ? 'hover:-translate-y-2 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700' : 'opacity-75'
                  }`}>
                  {/* Gradient header - monochromatic */}
                  <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-700 dark:to-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white/80">
                      {project.icon}
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

                    {/* Coming soon badge */}
                    {project.comingSoon && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                        Coming Soon
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400">
                        {project.technology}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {!project.comingSoon ? (
                      <Link
                        to={project.link}
                        className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                      >
                        Explore Tutorial
                        <ArrowForwardIcon className="group-hover/btn:translate-x-1 transition-transform" sx={{ fontSize: 18 }} />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-500 rounded-xl font-medium cursor-not-allowed">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
