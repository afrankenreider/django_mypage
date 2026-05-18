import { motion } from 'framer-motion'

const timeline = [
  {
    title: 'Analytics & Data Science Manager',
    company: 'Caterpillar, Inc.',
    period: 'May 2024 - Present',
    summary: 'Leading analytics and automation work for accounting and finance, S&OP, and operations across the Earthmoving Division.',
  },
  {
    title: 'Data Scientist',
    company: 'Caterpillar, Inc.',
    period: 'Apr 2023 - May 2024',
    summary: 'Developed and deployed Earthmoving Mission Control, a centralized home for reports, web apps, ML models, access management, and AI-enabled analytics.',
  },
  {
    title: 'Data Scientist',
    company: 'C.H. Robinson',
    period: 'Oct 2021 - Apr 2023',
    summary: 'Built intermodal pricing APIs, user-facing quote tools, ETL processes, and data pipelines with Python, Kubernetes, Azure DevOps, Airflow, Snowflake, and PostgreSQL.',
  },
  {
    title: 'Senior Data Analyst',
    company: 'C.H. Robinson',
    period: 'Apr 2021 - Sep 2021',
    summary: 'Delivered dashboards and reporting tools for volume and revenue tracking, market trends, yield management, and operational KPIs.',
  },
  {
    title: 'Data Analyst',
    company: 'C.H. Robinson',
    period: 'Jun 2018 - Apr 2021',
    summary: 'Developed automation bots and handled long-term and ad hoc project requests focused on cost reduction, efficiency, and volume and revenue growth.',
  },
]

const capabilities = [
  'Centralized analytics platforms',
  'Power BI reporting ecosystems',
  'Django and API application development',
  'Airflow, Snowflake, and PostgreSQL pipelines',
  'Kubernetes and Azure DevOps deployments',
  'Operational automation and bot development',
  'ML model deployment and AI integration',
  'Stakeholder intake, prioritization, and delivery',
]

export default function About() {
  return (
    <section className="apple-page pt-28 pb-24">
      <div className="apple-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-6">About</p>
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl">
                I build data products grounded in business operations.
              </h1>
            </div>
            <div className="space-y-6 pt-2 text-lg leading-relaxed text-[#424245] dark:text-[#d2d2d7]">
              <p>
                My professional experience sits at the intersection of data science, analytics engineering, full-stack application development, and process automation. I have built tools for accounting and finance, S&OP, operations, transportation pricing, business development, and leadership reporting.
              </p>
              <p>
                At Caterpillar, I developed and deployed Earthmoving Mission Control, a centralized platform for analytics and data science products across the Earthmoving Division. At C.H. Robinson, I built real-time pricing APIs, quote submission tools, ETL pipelines, dashboards, and automation bots that supported cost reduction, revenue growth, and day-to-day operational execution.
              </p>
              <p>
                Outside of work, I enjoy reading, exploring new technology, spending time with family, and finding time for golf. This site is where I share projects and examples that reflect the kind of practical analytics work I enjoy building.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
          >
            <div className="flex items-end justify-between border-b hairline pb-4">
              <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
              <span className="text-sm text-[#86868b]">2018 to now</span>
            </div>
            <div className="divide-y divide-black/10 dark:divide-white/10">
              {timeline.map((item) => (
                <div key={`${item.title}-${item.period}`} className="grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div>
                    <h3 className="font-semibold tracking-tight">{item.title}</h3>
                    <p className="apple-copy mt-1 text-sm">{item.company}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#424245] dark:text-[#d2d2d7]">{item.summary}</p>
                  </div>
                  <p className="text-sm text-[#86868b] sm:text-right">{item.period}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="border-b hairline pb-4">
              <h2 className="text-2xl font-semibold tracking-tight">What I have shipped</h2>
            </div>
            <div className="divide-y divide-black/10 dark:divide-white/10">
              {capabilities.map((capability, index) => (
                <div key={capability} className="flex items-center gap-5 py-5">
                  <span className="text-sm text-[#86868b]">{String(index + 1).padStart(2, '0')}</span>
                  <p className="text-lg font-medium tracking-tight">{capability}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
