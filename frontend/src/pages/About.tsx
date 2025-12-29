import { motion } from 'framer-motion'
import WorkIcon from '@mui/icons-material/Work'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FavoriteIcon from '@mui/icons-material/Favorite'
import meImage from '../assets/me.jpg'

export default function About() {
  return (
    <section className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              About Me
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-forest-500 mx-auto rounded-full" />
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
                <div className="w-64 h-64 mx-auto rounded-2xl bg-gradient-to-br from-primary-400 to-forest-500 p-1">
                  <img 
                    src={meImage} 
                    alt="Profile photo" 
                    className="w-full h-full rounded-2xl object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-100 rounded-full -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-forest-100 rounded-full -z-10" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <WorkIcon className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-forest-800">Professional Journey</h2>
                </div>
                <div className="space-y-4 text-earth-700 leading-relaxed">
                  <p>
                    I am currently a Data Science Manager, leading teams that solve complex supply chain problems 
                    using cutting-edge technology and data-driven solutions.
                  </p>
                  <p>
                    Throughout my career, I have progressed through roles as a data analyst, senior data analyst, 
                    and data scientist. I have a passion for leveraging technology and creating data products 
                    that enable teams to better serve clients and drive business value.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MenuBookIcon className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-forest-800">What I Do</h2>
                </div>
                <div className="space-y-4 text-earth-700 leading-relaxed">
                  <p>
                    My focus areas include pricing analysis and solution design, data analytics, 
                    and robotic process automation (RPA). Day-to-day, I work on:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>API and front-end application development</li>
                    <li>Creation and management of automated data pipelines</li>
                    <li>Development and deployment of process automation bots</li>
                    <li>Machine learning model development and deployment</li>
                    <li>Ad hoc exploratory data analysis</li>
                  </ul>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <FavoriteIcon className="text-primary-600" />
                  <h2 className="text-xl font-semibold text-forest-800">Beyond Work</h2>
                </div>
                <p className="text-earth-700 leading-relaxed">
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
