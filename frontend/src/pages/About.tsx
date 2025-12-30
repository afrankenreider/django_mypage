import { motion } from 'framer-motion'
import WorkIcon from '@mui/icons-material/Work'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FavoriteIcon from '@mui/icons-material/Favorite'

const timeline = [
  {
    title: "Analytics & Data Science Manager",
    company: "Caterpillar, Inc.",
    period: "May 2024 - Present",
    current: true,
  },
  {
    title: "Data Scientist",
    company: "Caterpillar, Inc.",
    period: "Apr 2023 - May 2024",
    current: false,
  },
  {
    title: "Data Scientist",
    company: "C.H. Robinson",
    period: "Oct 2021 - Apr 2023",
    current: false,
  },
  {
    title: "Senior Data Analyst",
    company: "C.H. Robinson",
    period: "Apr 2021 - Sep 2021",
    current: false,
  },
  {
    title: "Data Analyst",
    company: "C.H. Robinson",
    period: "Jun 2018 - Apr 2021",
    current: false,
  },
]

export default function About() {
  return (
    <section className="min-h-screen pt-24 pb-16 bg-white/80 dark:bg-slate-950/80 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Compact Header */}
          <div className="text-center mb-10">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 mb-4"
            >
              Get to know me
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4">
              About <span className="gradient-text">Me</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A passionate data science leader with a love for building innovative solutions
            </p>
          </div>

          {/* Three Column Grid Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Professional Journey - Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-slate-900 dark:bg-white rounded-lg text-white dark:text-slate-900">
                  <WorkIcon sx={{ fontSize: 20 }} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Experience</h2>
              </div>

              {/* Compact Timeline */}
              <div className="relative">
                <div className="absolute left-[5px] top-1 bottom-1 w-px bg-gradient-to-b from-slate-900 via-slate-500 to-slate-300 dark:from-white dark:via-slate-500 dark:to-slate-700" />

                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="relative pl-6"
                    >
                      <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 ${item.current
                          ? 'bg-slate-900 dark:bg-white border-slate-200 dark:border-slate-700'
                          : 'bg-slate-300 dark:bg-slate-600 border-slate-100 dark:border-slate-800'
                        }`} />
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.company}</p>
                        <p className="text-xs text-slate-500">{item.period}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* What I Do - Middle Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-slate-900 dark:bg-white rounded-lg text-white dark:text-slate-900">
                  <MenuBookIcon sx={{ fontSize: 20 }} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What I Do</h2>
              </div>
              <ul className="space-y-3">
                {[
                  "API and frontend app development",
                  "Automated data pipelines",
                  "Process automation bots",
                  "ML model development & deployment",
                  "Exploratory data analysis",
                  "Team leadership & mentoring"
                ].map((skill, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-900 dark:bg-white rounded-full flex-shrink-0" />
                    <span className="text-sm">{skill}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Beyond Work - Right Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 bg-slate-900 dark:bg-white rounded-lg text-white dark:text-slate-900">
                  <FavoriteIcon sx={{ fontSize: 20 }} />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Beyond Work</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                In my free time, I enjoy reading, exploring new technology, spending time with family,
                and sneaking in a round of golf whenever possible. I use this site as an avenue to publish
                and document side projects as I continue my journey in data science.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
