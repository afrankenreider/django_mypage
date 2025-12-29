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
  // Languages & Frameworks
  { name: 'Python', Icon: TerminalIcon, category: 'Languages', url: 'https://python.org/' },
  { name: 'R', Icon: InsightsIcon, category: 'Languages', url: 'https://www.r-project.org/' },
  { name: 'SQL', Icon: StorageIcon, category: 'Languages', url: 'https://www.postgresql.org/' },
  { name: 'Django', Icon: WebIcon, category: 'Frameworks', url: 'https://www.djangoproject.com/' },
  { name: 'React', Icon: CodeIcon, category: 'Frameworks', url: 'https://react.dev/' },
  
  // DevOps & Tools
  { name: 'Docker', Icon: CloudIcon, category: 'DevOps', url: 'https://www.docker.com/' },
  { name: 'Kubernetes', Icon: IntegrationInstructionsIcon, category: 'DevOps', url: 'https://kubernetes.io/' },
  { name: 'Git', Icon: SourceIcon, category: 'DevOps', url: 'https://git-scm.com/' },
  { name: 'Jenkins', Icon: BuildIcon, category: 'DevOps', url: 'https://www.jenkins.io/' },
  
  // Data & ML
  { name: 'Machine Learning', Icon: SmartToyIcon, category: 'Data Science', url: '#' },
  { name: 'Data Pipelines', Icon: SyncIcon, category: 'Data Science', url: '#' },
  { name: 'Analytics', Icon: InsightsIcon, category: 'Data Science', url: '#' },
  
  // Web
  { name: 'HTML5', Icon: Html5Icon, category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { name: 'CSS3', Icon: BrushIcon, category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { name: 'TypeScript', Icon: DataObjectIcon, category: 'Web', url: 'https://www.typescriptlang.org/' },
]

const categories = [...new Set(skills.map(s => s.category))]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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
              Skills & Tools
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-forest-500 mx-auto rounded-full mb-6" />
            <p className="text-lg text-earth-700 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Skills by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-semibold text-forest-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-primary-500 rounded-full" />
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
                      className="group glass-card rounded-xl p-6 text-center hover-lift cursor-pointer"
                    >
                      <div className="mb-3 flex justify-center group-hover:scale-110 transition-transform text-forest-600 group-hover:text-primary-600">
                        <skill.Icon sx={{ fontSize: 40 }} />
                      </div>
                      <h3 className="font-medium text-forest-700 group-hover:text-primary-600 transition-colors">
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
            <h2 className="text-2xl font-semibold text-forest-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary-500 rounded-full" />
              Areas of Expertise
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {expertiseAreas.map((area) => (
                <div
                  key={area.title}
                  className="glass-card rounded-2xl p-8 hover-lift"
                >
                  <div className="mb-4 text-primary-600">
                    <area.Icon sx={{ fontSize: 40 }} />
                  </div>
                  <h3 className="text-xl font-semibold text-forest-800 mb-2">{area.title}</h3>
                  <p className="text-earth-700">{area.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
