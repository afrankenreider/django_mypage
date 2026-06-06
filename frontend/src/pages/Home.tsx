import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailIcon from '@mui/icons-material/Email'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import headshot from '../assets/me.jpg'

const stats = [
  { value: '100+', label: 'Reports, apps & ML models in production' },
  { value: '7+ yrs', label: 'Building data products end to end' },
  { value: '2', label: 'Fortune 500 analytics organizations' },
]

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
      <section className="apple-section flex min-h-screen items-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="eyebrow mb-6">Analytics & Data Science Leadership</p>
              <h1 className="display-heading max-w-4xl text-6xl sm:text-7xl lg:text-8xl">
                Andrew Frankenreider
              </h1>
              <p className="apple-copy mt-7 max-w-2xl text-xl sm:text-2xl">
                Analytics and data science manager working at the intersection of data, automation, and the decisions businesses make every day.
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#424245] dark:text-[#d2d2d7]">
                At Caterpillar I built Earthmoving Mission Control, a central platform that brings 100+ Power BI reports, web apps, and ML models into one place for the Earthmoving Division.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/projects" className="quiet-link">
                  View work
                  <ArrowForwardIcon sx={{ fontSize: 17 }} />
                </Link>
                <Link to="/about" className="text-link px-2 py-3">
                  About me
                </Link>
                <div className="ml-1 flex items-center gap-1.5">
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
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md"
            >
              <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-tr from-blue-500/25 via-cyan-400/20 to-teal-400/25 blur-3xl" />
              <div className="relative aspect-square overflow-hidden rounded-full border hairline shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]">
                <img
                  src={headshot}
                  alt="Andrew Frankenreider"
                  className="h-full w-full scale-[1.04] object-cover"
                  loading="eager"
                />
              </div>
            </motion.div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border hairline bg-black/[0.04] sm:grid-cols-3 dark:bg-white/[0.06]">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.5 }}
                className="bg-[#f5f5f7] px-7 py-8 dark:bg-black"
              >
                <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{stat.value}</p>
                <p className="apple-copy mt-3 text-sm">{stat.label}</p>
              </motion.div>
            ))}
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
          <a href="mailto:afrankenreider@gmail.com" className="quiet-link self-start">
            Get in touch
            <ArrowForwardIcon sx={{ fontSize: 17 }} />
          </a>
        </div>
      </section>
    </div>
  )
}
