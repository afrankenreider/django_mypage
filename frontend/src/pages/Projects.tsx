import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface Project {
  id: number
  title: string
  description: string
  technology: string
  link: string
  comingSoon?: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Linear Regression',
    description: 'Regression, residuals, and fit.',
    technology: 'Machine Learning',
    link: '/projects/linear-regression',
  },
  {
    id: 2,
    title: 'K-Means Clustering',
    description: 'Assignments, centroids, and convergence.',
    technology: 'Machine Learning',
    link: '/projects/kmeans',
  },
  {
    id: 3,
    title: 'Neural Networks',
    description: 'Layers, activations, and forward propagation.',
    technology: 'Deep Learning',
    link: '/projects/neural-networks',
  },
  {
    id: 4,
    title: 'Finance Dashboard',
    description: 'Watchlists, trends, and forecasts.',
    technology: 'Financial Analysis',
    link: '/projects/finance-dashboard',
  },
  {
    id: 5,
    title: 'Data Pipelines',
    description: 'ETL structure, scheduling, and monitoring.',
    technology: 'Data Engineering',
    link: '/projects/data-pipelines',
    comingSoon: true,
  },
]

export default function Projects() {
  return (
    <section className="apple-page pt-28 pb-24">
      <div className="apple-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
        >
          <div>
            <p className="eyebrow mb-6">Projects</p>
            <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl">
              Project demos.
            </h1>
          </div>
          <p className="apple-copy max-w-2xl text-xl">
            Concise examples for modeling, analytics, and data products.
          </p>
        </motion.div>

        <div className="mt-20 divide-y divide-black/10 border-y hairline dark:divide-white/10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
              className="group grid gap-6 py-8 md:grid-cols-[80px_1fr_auto] md:items-center"
            >
              <span className="text-sm text-[#86868b]">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight">{project.title}</h2>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-[#6e6e73] dark:bg-white/10 dark:text-[#a1a1a6]">
                    {project.technology}
                  </span>
                </div>
                <p className="apple-copy mt-3 max-w-2xl">{project.description}</p>
              </div>
              {project.comingSoon ? (
                <span className="text-sm font-medium text-[#86868b]">Coming soon</span>
              ) : (
                <Link to={project.link} className="text-link justify-self-start md:justify-self-end">
                  Open
                  <ArrowForwardIcon className="transition-transform group-hover:translate-x-1" sx={{ fontSize: 17 }} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
