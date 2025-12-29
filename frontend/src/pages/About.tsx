import { motion } from 'framer-motion'
import WorkIcon from '@mui/icons-material/Work'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FavoriteIcon from '@mui/icons-material/Favorite'
import CodeIcon from '@mui/icons-material/Code'
import meImage from '../assets/me.jpg'

export default function About() {
  return (
    <section className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-300 dark:border-slate-700 mb-4">
              <CodeIcon className="text-slate-600 dark:text-slate-400" sx={{ fontSize: 18 }} />
              <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">about.md</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              About Me
            </h1>
            <div className="w-24 h-1 bg-slate-900 dark:bg-white mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="relative">
                <div className="w-64 h-64 mx-auto rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 p-1">
                  <img
                    src={meImage}
                    alt="Profile photo"
                    className="w-full h-full rounded-2xl object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-full -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-slate-300 dark:bg-slate-700 rounded-full -z-10" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white dark:bg-slate-900 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <WorkIcon className="text-slate-600 dark:text-slate-400" />
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Professional Journey</h2>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

                  <div className="space-y-6">
                    {/* Analytics & Data Science Manager */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-900 dark:bg-white border-4 border-slate-200 dark:border-slate-700" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Analytics & Data Science Manager</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Caterpillar, Inc.</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">May 2024 - Present</p>
                      </div>
                    </div>

                    {/* Data Scientist - Caterpillar */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-600 border-4 border-slate-200 dark:border-slate-700" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Data Scientist</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">Caterpillar, Inc.</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Apr 2023 - May 2024</p>
                      </div>
                    </div>

                    {/* Data Scientist - C.H. Robinson */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-600 border-4 border-slate-200 dark:border-slate-700" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Data Scientist</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">C.H. Robinson</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Oct 2021 - Apr 2023</p>
                      </div>
                    </div>

                    {/* Senior Data Analyst */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-600 border-4 border-slate-200 dark:border-slate-700" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Senior Data Analyst</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">C.H. Robinson</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Apr 2021 - Sep 2021</p>
                      </div>
                    </div>

                    {/* Data Analyst */}
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-400 dark:bg-slate-600 border-4 border-slate-200 dark:border-slate-700" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Data Analyst</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">C.H. Robinson</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Jun 2018 - Apr 2021</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <MenuBookIcon className="text-slate-600 dark:text-slate-400" />
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What I Do</h2>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  <p>
                    My focus areas include pricing analysis and solution design, data analytics,
                    and robotic process automation (RPA). Day-to-day, I work on:
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex items-center gap-2"><span className="text-slate-400">▹</span> API and front-end application development</li>
                    <li className="flex items-center gap-2"><span className="text-slate-400">▹</span> Creation and management of automated data pipelines</li>
                    <li className="flex items-center gap-2"><span className="text-slate-400">▹</span> Development and deployment of process automation bots</li>
                    <li className="flex items-center gap-2"><span className="text-slate-400">▹</span> Machine learning model development and deployment</li>
                    <li className="flex items-center gap-2"><span className="text-slate-400">▹</span> Ad hoc exploratory data analysis</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <FavoriteIcon className="text-slate-600 dark:text-slate-400" />
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Beyond Work</h2>
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
