import { enterIndex } from '../utils/motion'

const timeline = [
  {
    title: 'Senior Manager, Digital Architecture',
    company: 'Caterpillar',
    period: 'Aug 2026 - Present',
    summary: 'Lead the team building an enterprise analytics platform for global finance: the application code, the AI chat interface and its harness, and the Azure infrastructure it runs on.',
  },
  {
    title: 'Manager, Analytics',
    company: 'Caterpillar',
    period: 'May 2024 - Aug 2026',
    summary: 'Managed a team building ML models, Power BI reports, web apps, and automation for accounting, finance, and S&OP.',
  },
  {
    title: 'Data Scientist',
    company: 'Caterpillar',
    period: 'Apr 2023 - May 2024',
    summary: 'Built Earthmoving Mission Control, one place for the division\'s 100+ Power BI reports, web apps, ML models, and access management. Django, Celery, Redis, Docker, Azure.',
  },
  {
    title: 'Data Scientist',
    company: 'C.H. Robinson',
    period: 'Oct 2021 - Apr 2023',
    summary: 'Built a real-time pricing API for intermodal quotes on Kubernetes, plus the Django front end that handled quote requests. Ran ETL pipelines in Airflow, Snowflake, and PostgreSQL.',
  },
  {
    title: 'Senior Data Analyst',
    company: 'C.H. Robinson',
    period: 'Apr 2021 - Sep 2021',
    summary: 'Built dashboards for leadership covering volume, revenue, market trends, and yield, and bots that automated parts of operations and business development.',
  },
  {
    title: 'Data Analyst',
    company: 'C.H. Robinson',
    period: 'Jun 2018 - Apr 2021',
    summary: 'Reporting and analysis.',
  },
]

const education = [
  {
    degree: "Master's, Management Information Systems",
    school: 'Northern Illinois University',
    period: '2017 - 2018',
  },
  {
    degree: 'Operations and Information Management, emphasis in Information Systems',
    school: 'Northern Illinois University',
    period: '2013 - 2017',
  },
]

export default function About() {
  return (
    <div className="apple-page pb-24 pt-14 sm:pt-16">
      <div className="apple-section">
        <header className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
          <div className="enter">
            <h1 className="display-heading display-page">
              About me.
            </h1>
            <p className="apple-copy mt-6 max-w-md text-lg">
              Senior Manager, Digital Architecture at Caterpillar
            </p>
          </div>
          <div className="body-copy enter max-w-[65ch] space-y-5 text-lg lg:pt-2" style={enterIndex(1)}>
            <p>
              I run the team behind Caterpillar's enterprise analytics platform for global finance. We own all of it: the backend and frontend code, the AI chat interface and the harness behind it, and the Azure infrastructure that hosts it.
            </p>
            <p>
              I started as a data analyst at C.H. Robinson in 2018, building dashboards and bots, and moved into data science there writing pricing APIs and Airflow pipelines. At Caterpillar I built Earthmoving Mission Control as a data scientist, then managed the analytics team before taking this role.
            </p>
            <p>
              I write Python, R, SQL, and JavaScript. This site has my work history and a few side projects.
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
              <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
            </div>
            <ol className="divide-y divide-[var(--hairline)]">
              {education.map((item) => (
                <li key={item.degree} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div>
                    <h3 className="font-semibold tracking-tight">{item.degree}</h3>
                    <p className="apple-copy mt-1 text-sm">{item.school}</p>
                  </div>
                  <p className="text-sm tabular-nums text-muted sm:text-right">{item.period}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}
