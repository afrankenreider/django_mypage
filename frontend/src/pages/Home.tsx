import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DataScienceAnimation from '../components/DataScienceAnimation'
import SocialLinks, { CONTACT_EMAIL } from '../components/SocialLinks'
import { enterIndex } from '../utils/motion'

const stats = [
  { value: '100+', label: 'analytics products' },
  { value: '7+', label: 'years in data' },
  { value: '2', label: 'enterprise teams' },
]

const focusAreas = [
  {
    title: 'ML models',
    description: 'Forecasting and classification models for finance and S&OP.',
  },
  {
    title: 'Dashboards and automation',
    description: 'Power BI reporting and RPA that removes manual work from accounting processes.',
  },
  {
    title: 'Web applications',
    description: 'Django and React apps backed by Airflow, Snowflake, and PostgreSQL.',
  },
]

export default function Home() {
  return (
    <div className="apple-page">
      <section className="apple-section pb-20 pt-14 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h1 className="display-heading display-hero enter">Andrew Frankenreider</h1>
            <p className="apple-copy enter mt-6 max-w-2xl text-xl sm:text-2xl" style={enterIndex(1)}>
              Data science and analytics manager at Caterpillar, Inc.
            </p>
            <p className="body-copy enter mt-5 max-w-[60ch] text-lg" style={enterIndex(2)}>
              I manage a team in our financial services division that builds ML models, analytics dashboards, web applications, and process automation for accounting, finance, and sales and operations planning.
            </p>
            <div className="enter mt-9 flex flex-wrap items-center gap-x-5 gap-y-4" style={enterIndex(3)}>
              <Link to="/projects" className="quiet-link">
                View work
                <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
              </Link>
              <Link to="/about" className="text-link py-3">
                About me
              </Link>
              <SocialLinks />
            </div>
          </div>

          <div className="enter mx-auto w-full max-w-xl" style={enterIndex(2)}>
            <DataScienceAnimation />
          </div>
        </div>

        <dl
          className="enter mt-14 flex flex-col gap-x-12 gap-y-4 border-t hairline pt-6 sm:flex-row sm:flex-wrap"
          style={enterIndex(4)}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <dt className="order-2 apple-copy">{stat.label}</dt>
              <dd className="order-1 text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="apple-section pb-24">
        <h2 className="text-sm font-semibold text-muted">
          What my team builds
        </h2>
        <ul className="mt-6 grid gap-x-10 md:grid-cols-3">
          {focusAreas.map((area) => (
            <li key={area.title} className="border-t hairline py-6">
              <h3 className="text-2xl font-semibold tracking-tight">{area.title}</h3>
              <p className="apple-copy mt-3 max-w-[40ch]">{area.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="apple-section pb-24">
        <div className="ink-band rounded-[2rem] px-6 py-12 sm:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Interactive demos of the methods I use at work.
            </h2>
            <Link to="/projects" className="quiet-link justify-self-start">
              Open the demos
              <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
            </Link>
          </div>
        </div>
      </section>

      <section className="apple-section pb-28">
        <div className="flex flex-col gap-6 border-t hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-xl text-2xl font-semibold tracking-tight">
            Questions about the work or the demos?
          </h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className="quiet-link self-start">
            Email me
            <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
          </a>
        </div>
      </section>
    </div>
  )
}
