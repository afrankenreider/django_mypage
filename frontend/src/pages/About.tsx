import { usePageTitle } from '../hooks/usePageTitle'
import { enterIndex } from '../utils/motion'

const timeline = [
  {
    title: 'Data Science & Analytics Manager',
    company: 'Caterpillar, Inc.',
    period: 'May 2024 - Present',
    summary: 'Manage a team building ML models, dashboards, web apps, and RPA for accounting, finance, and S&OP in the financial services division.',
  },
  {
    title: 'Data Scientist',
    company: 'Caterpillar, Inc.',
    period: 'Apr 2023 - May 2024',
    summary: 'Built Earthmoving Mission Control for reports, apps, models, and access.',
  },
  {
    title: 'Data Scientist',
    company: 'C.H. Robinson',
    period: 'Oct 2021 - Apr 2023',
    summary: 'Built pricing APIs, quote tools, ETL, and pipelines.',
  },
  {
    title: 'Senior Data Analyst',
    company: 'C.H. Robinson',
    period: 'Apr 2021 - Sep 2021',
    summary: 'Delivered dashboards for revenue, market trends, yield, and KPIs.',
  },
  {
    title: 'Data Analyst',
    company: 'C.H. Robinson',
    period: 'Jun 2018 - Apr 2021',
    summary: 'Built automation for cost reduction, efficiency, and revenue growth.',
  },
]

const capabilities = [
  'Centralized analytics platforms',
  'Power BI reporting ecosystems',
  'Django and API application development',
  'Airflow, Snowflake, and PostgreSQL pipelines',
  'Kubernetes and Azure DevOps deployments',
  'Operational automation and bot development',
  'ML model deployment',
  'Stakeholder intake, prioritization, and delivery',
]

export default function About() {
  usePageTitle('About')

  return (
    <div className="apple-page pb-24 pt-14 sm:pt-16">
      <div className="apple-section">
        <header className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
          <div className="enter">
            <h1 className="display-heading display-page">
              Data science and analytics for finance.
            </h1>
            <p className="apple-copy mt-6 max-w-md text-lg">
              Andrew Frankenreider, Data Science & Analytics Manager
            </p>
          </div>
          <div className="body-copy enter max-w-[65ch] space-y-5 text-lg lg:pt-2" style={enterIndex(1)}>
            <p>
              I manage a data science and analytics team in Caterpillar's financial services division. We build ML models, analytics dashboards, web applications, and process automation (RPA) for accounting and finance and for sales and operations planning.
            </p>
            <p>
              Before this role, I developed Earthmoving Mission Control at Caterpillar. At C.H. Robinson, I built pricing APIs, ETL pipelines, dashboards, and automation bots.
            </p>
            <p>
              This site is where I keep my resume and a few interactive demos of the methods I use.
            </p>
          </div>
        </header>

        <div className="enter mt-16 grid gap-14 sm:mt-20 lg:grid-cols-2" style={enterIndex(2)}>
          <section>
            <div className="flex items-end justify-between gap-4 border-b hairline pb-4">
              <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
              <p className="text-sm text-muted">2018 to now</p>
            </div>
            <ol className="divide-y divide-[var(--hairline)]">
              {timeline.map((item) => (
                <li key={`${item.title}-${item.period}`} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div>
                    <h3 className="font-semibold tracking-tight">{item.title}</h3>
                    <p className="apple-copy mt-1 text-sm">{item.company}</p>
                    <p className="body-copy mt-3 text-sm">{item.summary}</p>
                  </div>
                  <p className="text-sm tabular-nums text-muted sm:text-right">{item.period}</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <div className="border-b hairline pb-4">
              <h2 className="text-2xl font-semibold tracking-tight">What I have shipped</h2>
            </div>
            <ul className="divide-y divide-[var(--hairline)]">
              {capabilities.map((capability) => (
                <li key={capability} className="py-4 text-lg font-medium tracking-tight">
                  {capability}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
