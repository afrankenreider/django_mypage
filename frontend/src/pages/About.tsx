import { motion } from 'framer-motion'
import WorkIcon from '@mui/icons-material/Work'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FavoriteIcon from '@mui/icons-material/Favorite'
import meImage from '../assets/me.jpg'

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
    <section className="min-h-screen pt-32 pb-24 bg-white/80 dark:bg-slate-950/80 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 mb-6"
            >
              Get to know me
            </motion.span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              About <span className="gradient-text">Me</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A passionate data science leader with a love for building innovative solutions
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-16 items-start">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="relative">
                {/* Gradient border effect - monochromatic */}
                <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 rounded-3xl blur-lg opacity-20" />
                <div className="relative bg-white dark:bg-slate-900 p-2 rounded-3xl">
                  <img
                    src={meImage}
                    alt="Profile photo"
                    className="w-full aspect-square rounded-2xl object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-slate-300 to-slate-400 rounded-2xl -z-10 opacity-20"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-slate-400 to-slate-500 rounded-xl -z-10 opacity-20"
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-3 space-y-8"
            >
              {/* Professional Journey */}
              <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900">
                    <WorkIcon sx={{ fontSize: 24 }} />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Professional Journey</h2>
                </div>

                {/* Timeline */}
                <div className="relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-slate-900 via-slate-500 to-slate-300 dark:from-white dark:via-slate-500 dark:to-slate-700" />

                  <div className="space-y-6">
                    {timeline.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="relative pl-8"
                      >
                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 ${
                          item.current
                            ? 'bg-slate-900 dark:bg-white border-slate-200 dark:border-slate-700'
                            : 'bg-slate-300 dark:bg-slate-600 border-slate-100 dark:border-slate-800'
                        }`} />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">{item.company}</p>
                          <p className="text-sm text-slate-500">{item.period}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What I Do */}
              <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900">
                    <MenuBookIcon sx={{ fontSize: 24 }} />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">What I Do</h2>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  <ul className="grid sm:grid-cols-2 gap-3 mt-4">
                    {[
                      "API and frontend app development",
                      "Automated data pipelines",
                      "Process automation bots",
                      "ML model development & deployment",
                      "Exploratory data analysis",
                      "Team leadership & mentoring"
                    ].map((skill, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-slate-900 dark:bg-white rounded-full" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Beyond Work */}
              <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900">
                    <FavoriteIcon sx={{ fontSize: 24 }} />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Beyond Work</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  In my free time, I enjoy reading, exploring new technology, spending time with family,
                  and sneaking in a round of golf whenever possible. I use this site as an avenue to publish
                  and document side projects as I continue my journey in data science.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
