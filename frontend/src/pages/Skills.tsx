import { motion } from 'framer-motion'
import CodeIcon from '@mui/icons-material/Code'
import StorageIcon from '@mui/icons-material/Storage'
import WebIcon from '@mui/icons-material/Web'
import TerminalIcon from '@mui/icons-material/Terminal'
import DataObjectIcon from '@mui/icons-material/DataObject'
import CloudIcon from '@mui/icons-material/Cloud'
import BuildIcon from '@mui/icons-material/Build'
import SourceIcon from '@mui/icons-material/Source'
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SyncIcon from '@mui/icons-material/Sync'
import InsightsIcon from '@mui/icons-material/Insights'
import Html5Icon from '@mui/icons-material/Html'
import BrushIcon from '@mui/icons-material/Brush'
import PsychologyIcon from '@mui/icons-material/Psychology'
import BoltIcon from '@mui/icons-material/Bolt'
import ComputerIcon from '@mui/icons-material/Computer'
import { SvgIconComponent } from '@mui/icons-material'

interface Skill {
  name: string
  Icon: SvgIconComponent
  category: string
  url: string
}

const skills: Skill[] = [
  { name: 'Python', Icon: TerminalIcon, category: 'Languages', url: 'https://python.org/' },
  { name: 'R', Icon: InsightsIcon, category: 'Languages', url: 'https://www.r-project.org/' },
  { name: 'SQL', Icon: StorageIcon, category: 'Languages', url: 'https://www.postgresql.org/' },
  { name: 'Django', Icon: WebIcon, category: 'Frameworks', url: 'https://www.djangoproject.com/' },
  { name: 'React', Icon: CodeIcon, category: 'Frameworks', url: 'https://react.dev/' },
  { name: 'Docker', Icon: CloudIcon, category: 'DevOps', url: 'https://www.docker.com/' },
  { name: 'Kubernetes', Icon: IntegrationInstructionsIcon, category: 'DevOps', url: 'https://kubernetes.io/' },
  { name: 'Git', Icon: SourceIcon, category: 'DevOps', url: 'https://git-scm.com/' },
  { name: 'Jenkins', Icon: BuildIcon, category: 'DevOps', url: 'https://www.jenkins.io/' },
  { name: 'Machine Learning', Icon: SmartToyIcon, category: 'Data Science', url: '#' },
  { name: 'Data Pipelines', Icon: SyncIcon, category: 'Data Science', url: '#' },
  { name: 'Analytics', Icon: InsightsIcon, category: 'Data Science', url: '#' },
  { name: 'HTML5', Icon: Html5Icon, category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { name: 'CSS3', Icon: BrushIcon, category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { name: 'TypeScript', Icon: DataObjectIcon, category: 'Web', url: 'https://www.typescriptlang.org/' },
]

const categories = [...new Set(skills.map(s => s.category))]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface ExpertiseArea {
  title: string
  description: string
  Icon: SvgIconComponent
}

const expertiseAreas: ExpertiseArea[] = [
  {
    title: 'Data Science & ML',
    description: 'Building predictive models, statistical analysis, and deriving insights from complex datasets.',
    Icon: PsychologyIcon,
  },
  {
    title: 'Process Automation',
    description: 'Designing and implementing RPA solutions to streamline business processes and reduce manual work.',
    Icon: BoltIcon,
  },
  {
    title: 'Full-Stack Development',
    description: 'Creating end-to-end applications from APIs to user interfaces with modern tech stacks.',
    Icon: ComputerIcon,
  },
]

export default function Skills() {
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
              <TerminalIcon className="text-slate-600 dark:text-slate-400" sx={{ fontSize: 18 }} />
              <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">skills.json</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Skills & Tools
            </h1>
            <div className="w-24 h-1 bg-slate-900 dark:bg-white mx-auto rounded-full mb-6" />
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Skills by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
                {category}
              </h2>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <motion.a
                      key={skill.name}
                      variants={itemVariants}
                      href={skill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="mb-3 flex justify-center group-hover:scale-110 transition-transform text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                        <skill.Icon sx={{ fontSize: 40 }} />
                      </div>
                      <h3 className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {skill.name}
                      </h3>
                    </motion.a>
                  ))}
              </motion.div>
            </div>
          ))}

          {/* Expertise Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
              Areas of Expertise
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {expertiseAreas.map((area) => (
                <div
                  key={area.title}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 text-slate-600 dark:text-slate-400">
                    <area.Icon sx={{ fontSize: 40 }} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{area.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{area.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
