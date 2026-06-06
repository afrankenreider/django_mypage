import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const focusAreas = [
  {
    title: 'Analytics platforms',
    description: 'Reporting, apps, and models brought together in one place.',
  },
  {
    title: 'Automation',
    description: 'APIs, pipelines, and dashboards for finance, pricing, and operations.',
  },
  {
    title: 'Full-stack delivery',
    description: 'Python, Django, Airflow, Snowflake, PostgreSQL, and Power BI.',
  },
]

const socialLinks = [
  { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, href: 'https://www.linkedin.com/in/andrew-frankenreider-934581b1/', label: 'LinkedIn' },
  { icon: <GitHubIcon sx={{ fontSize: 18 }} />, href: 'https://github.com/afrankenreider', label: 'GitHub' },
  { icon: <EmailIcon sx={{ fontSize: 18 }} />, href: 'mailto:afrankenreider@gmail.com', label: 'Email' },
]

export default function Home() {
  return (
    <div className="apple-page">
      <section className="apple-section flex min-h-screen items-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full"
        >
          <p className="eyebrow mb-6">Portfolio</p>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <h1 className="display-heading max-w-5xl text-6xl sm:text-7xl lg:text-8xl">
                Andrew Frankenreider
              </h1>
              <p className="apple-copy mt-8 max-w-2xl text-xl sm:text-2xl">
                Analytics and data science manager. Working at the intersection of data, automation, and business insights.
              </p>
            </div>
            <div className="lg:pb-3">
              <p className="text-lg leading-relaxed text-[#424245] dark:text-[#d2d2d7]">
                At Caterpillar, I built Earthmoving Mission Control, a central analytics platform with 100+ Power BI reports, web apps, and ML models.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/projects" className="quiet-link">
                  View work
                  <ArrowForwardIcon sx={{ fontSize: 17 }} />
                </Link>
                <Link to="/about" className="text-link px-2 py-3">
                  About me
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="apple-section pb-24">
        <div className="soft-rule mb-12" />
        <div className="grid gap-8 md:grid-cols-3">
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="border-t hairline pt-6"
            >
              <span className="text-sm text-[#86868b]">0{index + 1}</span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">{area.title}</h2>
              <p className="apple-copy mt-4">{area.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="apple-section pb-28">
        <div className="rounded-[2rem] bg-[#1d1d1f] px-6 py-12 text-white dark:bg-[#161617] sm:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/50">Selected work</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Tools for analytics, automation, and reporting.
              </h2>
            </div>
            <Link to="/projects" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]">
              Explore projects
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </Link>
          </div>
        </div>
      </section>

      <section className="apple-section pb-28">
        <div className="flex flex-col gap-6 border-t hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-2xl font-semibold tracking-tight">
            Good data work helps people make better decisions, faster.
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border hairline text-[#6e6e73] transition-colors hover:bg-white hover:text-[#1d1d1f] dark:text-[#a1a1a6] dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
