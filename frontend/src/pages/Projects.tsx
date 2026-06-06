import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AnalyticsSignal from '../components/AnalyticsSignal'

interface Project {
  id: number
  title: string
  description: string
  technology: string
  link: string
  metrics: string[]
  comingSoon?: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Linear Regression',
    description: 'Regression, residuals, and fit.',
    technology: 'Machine Learning',
    link: '/projects/linear-regression',
    metrics: ['R² diagnostics', 'Residual views', 'Interactive fit'],
  },
  {
    id: 2,
    title: 'K-Means Clustering',
    description: 'Assignments, centroids, and convergence.',
    technology: 'Machine Learning',
    link: '/projects/kmeans',
    metrics: ['Live clusters', 'Centroid trace', 'Quality scoring'],
  },
  {
    id: 3,
    title: 'Neural Networks',
    description: 'Layers, activations, and forward propagation.',
    technology: 'Deep Learning',
    link: '/projects/neural-networks',
    metrics: ['Layer map', 'Activation flow', 'Notebook mode'],
  },
  {
    id: 4,
    title: 'Finance Dashboard',
    description: 'Watchlists, trends, and forecasts.',
    technology: 'Financial Analysis',
    link: '/projects/finance-dashboard',
    metrics: ['Market signal', 'Forecast lab', 'Watchlist'],
  },
  {
    id: 5,
    title: 'Data Pipelines',
    description: 'ETL structure, scheduling, and monitoring.',
    technology: 'Data Engineering',
    link: '/projects/data-pipelines',
    metrics: ['Lineage', 'Scheduling', 'Observability'],
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
          className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
        >
          <div>
            <p className="eyebrow mb-6">Projects</p>
            <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl">
              Work built like instruments.
            </h1>
            <p className="apple-copy mt-7 max-w-xl text-xl">
              Interactive analytics, clean product surfaces, and practical demos with the same calm visual system as the home page.
            </p>
          </div>
          <AnalyticsSignal title="Project command center" caption="A live-feeling overview for models, dashboards, pipelines, and automation work." />
        </motion.div>

        <div className="mt-20 grid gap-5">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06, duration: 0.5 }}
              className="apple-card-solid group grid gap-6 md:grid-cols-[76px_1fr_auto] md:items-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d1d1f] text-sm font-semibold text-white dark:bg-[#f5f5f7] dark:text-[#1d1d1f]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-semibold tracking-tight">{project.title}</h2>
                  <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-[#6e6e73] dark:bg-white/10 dark:text-[#a1a1a6]">
                    {project.technology}
                  </span>
                </div>
                <p className="apple-copy mt-3 max-w-2xl">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.metrics.map((metric) => (
                    <span key={metric} className="rounded-full border hairline px-3 py-1 text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                      {metric}
                    </span>
                  ))}
                </div>
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
