import { motion } from 'framer-motion'
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
import CodeIcon from '@mui/icons-material/Code'
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
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              Skills & <span className="gradient-text">Tools</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Expertise Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-20"
          >
            <div className="grid md:grid-cols-3 gap-8">
              {expertiseAreas.map((area, index) => (
                <motion.div
                  key={area.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className="h-full bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-slate-300 dark:hover:border-slate-700">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center mb-6 shadow-lg text-white dark:text-slate-900">
                      <area.Icon sx={{ fontSize: 28 }} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                      {area.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills by Category */}
          <div className="space-y-16">
            {categories.map((category) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-lg">
                    <span className="text-white dark:text-slate-900 font-bold text-lg">{category.charAt(0)}</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {category}
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill, index) => (
                      <motion.a
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        href={skill.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl"
                      >
                        <div className="mb-3 flex justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                          <skill.Icon sx={{ fontSize: 36 }} />
                        </div>
                        <h3 className="font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {skill.name}
                        </h3>
                      </motion.a>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
