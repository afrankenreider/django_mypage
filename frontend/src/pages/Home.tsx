import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DataScienceAnimation from '../components/DataScienceAnimation'
import SocialLinks, { CONTACT_EMAIL } from '../components/SocialLinks'
import { enterIndex } from '../utils/motion'

const stats = [
  { value: '8', label: 'years working with data' },
  { value: '100+', label: 'Power BI reports shipped on one platform' },
]

const focusAreas = [
  {
    title: 'The application',
    description: 'Backend and frontend code for the platform itself.',
  },
  {
    title: 'The AI chat interface',
    description: 'The chat interface built into the platform, and the harness that runs it.',
  },
  {
    title: 'The Azure infrastructure',
    description: 'All of the cloud infrastructure the platform is hosted on.',
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
              Senior Manager, Digital Architecture at Caterpillar
            </p>
            <p className="body-copy enter mt-5 max-w-[60ch] text-lg" style={enterIndex(2)}>
              I lead the team building Caterpillar's enterprise analytics platform for global finance. We write the application, run the Azure infrastructure under it, and build the AI chat interface people use to work with it.
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
          What my team owns
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
              A few models I built to run in the browser.
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
            Want to talk shop?
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
