import { motion } from 'framer-motion'

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
                Data science and analytics for finance.
              </h1>
              <p className="apple-copy mt-8 max-w-md text-lg">Andrew Frankenreider · Data Science & Analytics Manager</p>
            </div>
            <div className="space-y-6 pt-2 text-lg leading-relaxed text-[#424245] dark:text-[#d2d2d7]">
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
