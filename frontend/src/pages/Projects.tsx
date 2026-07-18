import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

interface Project {
  title: string
  description: string
  category: string
  link: string
  capabilities: string[]
}

const projects: Project[] = [
  {
    title: 'Linear Regression',
    description:
      'An interactive guide to model fitting, residual analysis, and regression diagnostics using practical datasets.',
    category: 'Statistical modeling',
    link: '/projects/linear-regression',
    capabilities: ['Interactive fit', 'Residual analysis', 'Model diagnostics'],
  },
  {
    title: 'K-Means Clustering',
    description:
      'A step-by-step visualization of centroid initialization, cluster assignment, and model convergence.',
    category: 'Unsupervised learning',
    link: '/projects/kmeans',
    capabilities: ['Live clustering', 'Iteration history', 'Quality scoring'],
  },
  {
    title: 'Neural Networks',
    description:
      'A visual workspace for exploring network architecture, activation functions, and forward propagation.',
    category: 'Deep learning',
    link: '/projects/neural-networks',
    capabilities: ['Layer controls', 'Activation flow', 'Training concepts'],
  },
  {
    title: 'Finance Dashboard',
    description:
      'A market analysis workspace combining watchlists, technical indicators, and forecasting experiments.',
    category: 'Financial analytics',
    link: '/projects/finance-dashboard',
    capabilities: ['Market overview', 'Forecasting lab', 'Custom watchlist'],
  },
]

export default function Projects() {
  return (
    <section className="apple-page pb-24 pt-28">
      <div className="apple-section">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="grid gap-10 border-b hairline pb-14 sm:pb-16 lg:grid-cols-[1.35fr_0.65fr] lg:items-end"
        >
          <div>
            <p className="eyebrow mb-6">Projects</p>
            <h1 className="display-heading max-w-4xl text-5xl sm:text-6xl lg:text-7xl">
              Interactive demos.
            </h1>
          </div>
          <p className="apple-copy max-w-xl text-lg sm:text-xl lg:pb-1">
            Browser-based walkthroughs of methods I use at work: regression,
            clustering, neural networks, and market data analysis.
          </p>
        </motion.header>

        <div className="mt-8 grid gap-px overflow-hidden rounded-3xl border hairline bg-black/[0.06] dark:bg-white/[0.08] sm:mt-10 sm:grid-cols-3">
          {[
            ['04', 'interactive demos'],
            ['03', 'data disciplines'],
            ['100%', 'browser based'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="bg-white px-6 py-6 dark:bg-[#161617] sm:px-7 sm:py-7"
            >
              <p className="text-2xl font-semibold tracking-tight">{value}</p>
              <p className="apple-copy mt-1 text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Demos</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Four interactive demos.
              </h2>
            </div>
            <p className="hidden text-sm text-[#86868b] sm:block">
              Built with React and TypeScript
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  delay: (index % 2) * 0.06,
                  duration: 0.45,
                  ease: 'easeOut',
                }}
                className="apple-card-solid group flex min-h-full flex-col p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-[#6e6e73] dark:text-[#a1a1a6]">
                    {project.category}
                  </p>
                  <span
                    className="text-sm tabular-nums text-[#86868b]"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-10 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {project.title}
                </h3>
                <p className="apple-copy mt-4 max-w-xl text-base sm:text-lg">
                  {project.description}
                </p>

                <ul
                  className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t hairline pt-5"
                  aria-label={`${project.title} capabilities`}
                >
                  {project.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="text-sm text-[#6e6e73] dark:text-[#a1a1a6]"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>

                <Link
                  to={project.link}
                  className="text-link mt-10 self-start rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                  aria-label={`Open ${project.title} demo`}
                >
                  Open demo
                  <ArrowForwardIcon
                    className="transition-transform group-hover:translate-x-1 group-focus-within:translate-x-1"
                    sx={{ fontSize: 17 }}
                  />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Contact</p>
            <p className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight">
              Questions about any of these? I'm happy to talk through the code.
            </p>
          </div>
          <a
            href="mailto:afrankenreider@gmail.com"
            className="quiet-link self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            Email me
            <ArrowForwardIcon sx={{ fontSize: 17 }} />
          </a>
        </div>
      </div>
    </section>
  )
}
