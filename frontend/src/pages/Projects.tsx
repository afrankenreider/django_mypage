import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import LaunchIcon from '@mui/icons-material/Launch'
import GitHubIcon from '@mui/icons-material/GitHub'
import FilterListIcon from '@mui/icons-material/FilterList'
import ComputerIcon from '@mui/icons-material/Computer'
import FolderIcon from '@mui/icons-material/Folder'

interface Project {
  id: number
  project_title: string
  description: string
  technology: string
  repository: string | null
  image: string | null
}

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

const fallbackProjects: Project[] = [
  {
    id: 1,
    project_title: 'Machine Learning Pipeline',
    description: 'End-to-end ML pipeline for demand forecasting using Python, scikit-learn, and automated deployment.',
    technology: 'Modeling',
    repository: 'https://github.com/afrankenreider',
    image: null,
  },
  {
    id: 2,
    project_title: 'Data Analytics Dashboard',
    description: 'Interactive dashboard built with Python and modern web technologies for real-time data visualization.',
    technology: 'Python',
    repository: 'https://github.com/afrankenreider',
    image: null,
  },
  {
    id: 3,
    project_title: 'Process Automation Bot',
    description: 'RPA solution that automates repetitive business processes, saving hours of manual work daily.',
    technology: 'Automation',
    repository: 'https://github.com/afrankenreider',
    image: null,
  },
  {
    id: 4,
    project_title: 'RESTful API Service',
    description: 'Scalable API built with Django REST Framework for data processing and integration.',
    technology: 'API',
    repository: 'https://github.com/afrankenreider',
    image: null,
  },
]

const techColors: Record<string, string> = {
  Python: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  API: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  Automation: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  Modeling: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects)
  const [filter, setFilter] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects/')
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setProjects(data)
          }
        }
      } catch (error) {
        console.log('Using fallback projects')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const technologies = ['All', ...new Set(projects.map((p) => p.technology))]
  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter((p) => p.technology === filter)

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
              <FolderIcon className="text-slate-600 dark:text-slate-400" sx={{ fontSize: 18 }} />
              <span className="text-slate-600 dark:text-slate-400 font-mono text-sm">~/projects</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Projects
            </h1>
            <div className="w-24 h-1 bg-slate-900 dark:bg-white mx-auto rounded-full mb-6" />
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A collection of projects showcasing my work in data science, automation, and software development
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <FilterListIcon className="text-slate-400 self-center" />
            {technologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`px-4 py-2 rounded-full font-medium transition-all border ${
                  filter === tech
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  layout
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
                >
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.project_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ComputerIcon sx={{ fontSize: 64 }} className="text-slate-400 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-600 transition-colors" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 to-transparent" />
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                        {project.project_title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${techColors[project.technology] || 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'}`}>
                        {project.technology}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {project.repository && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-slate-900 dark:text-white hover:text-slate-600 dark:hover:text-slate-300 font-medium transition-colors"
                      >
                        <GitHubIcon sx={{ fontSize: 18 }} />
                        View Code
                        <LaunchIcon sx={{ fontSize: 14 }} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filteredProjects.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No projects found for this filter.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
