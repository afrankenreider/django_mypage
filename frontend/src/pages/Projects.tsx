import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { CONTACT_EMAIL } from '../components/SocialLinks'
import { enterIndex } from '../utils/motion'

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
    <div className="apple-page pb-24 pt-14 sm:pt-16">
      <div className="apple-section">
        <header className="enter grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-10">
          <h1 className="display-heading display-page">Interactive demos.</h1>
          <p className="apple-copy max-w-xl text-lg sm:text-xl lg:pb-1">
            Browser-based walkthroughs of methods I use at work: regression,
            clustering, neural networks, and market data analysis.
          </p>
        </header>

        <ul className="enter mt-14 border-t hairline sm:mt-20" style={enterIndex(1)}>
          {projects.map((project) => (
            <li key={project.title} className="border-b hairline">
              <article className="group relative grid gap-x-10 gap-y-5 py-9 sm:py-11 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {/* The link's pseudo-element stretches over the row, so the whole row is the target. */}
                    <Link
                      to={project.link}
                      className="rounded-sm after:absolute after:inset-0 after:content-['']"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm font-medium text-muted">{project.category}</p>
                </div>

                <div>
                  <p className="apple-copy max-w-[60ch] text-base sm:text-lg">{project.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-body">
                    {project.capabilities.map((capability) => (
                      <li key={capability}>{capability}</li>
                    ))}
                  </ul>
                  <p className="text-link mt-6 group-hover:underline" aria-hidden="true">
                    Open demo
                    <ArrowForwardIcon
                      className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      sx={{ fontSize: 17 }}
                    />
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted">Built with React and TypeScript.</p>

        <div className="mt-16 flex flex-col gap-6 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight">
            Questions about any of these? I'm happy to talk through the code.
          </h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className="quiet-link self-start">
            Email me
            <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
          </a>
        </div>
      </div>
    </div>
  )
}
