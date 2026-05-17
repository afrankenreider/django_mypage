import { motion } from 'framer-motion'

const timeline = [
  { title: 'Analytics & Data Science Manager', company: 'Caterpillar, Inc.', period: 'May 2024 - Present' },
  { title: 'Data Scientist', company: 'Caterpillar, Inc.', period: 'Apr 2023 - May 2024' },
  { title: 'Data Scientist', company: 'C.H. Robinson', period: 'Oct 2021 - Apr 2023' },
  { title: 'Senior Data Analyst', company: 'C.H. Robinson', period: 'Apr 2021 - Sep 2021' },
  { title: 'Data Analyst', company: 'C.H. Robinson', period: 'Jun 2018 - Apr 2021' },
]

const capabilities = [
  'API and frontend app development',
  'Automated data pipelines',
  'Process automation bots',
  'ML model development and deployment',
  'Exploratory data analysis',
  'Team leadership and mentoring',
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
                I build where analytics meets execution.
              </h1>
            </div>
            <div className="space-y-6 pt-2 text-lg leading-relaxed text-[#424245] dark:text-[#d2d2d7]">
              <p>
                My work centers on making data science usable: the models need to be sound, the systems need to be dependable, and the experience needs to feel obvious to the people using it.
              </p>
              <p>
                Outside of work, I enjoy reading, exploring new technology, spending time with family, and finding time for golf. This site is where I document side projects and experiments as I keep learning.
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
              <h2 className="text-2xl font-semibold tracking-tight">What I tend to ship</h2>
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
