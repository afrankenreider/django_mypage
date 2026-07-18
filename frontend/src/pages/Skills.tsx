import { motion } from 'framer-motion'

interface Skill {
  name: string
  category: string
  url: string
}

const skills: Skill[] = [
  { name: 'Python', category: 'Languages', url: 'https://python.org/' },
  { name: 'R', category: 'Languages', url: 'https://www.r-project.org/' },
  { name: 'SQL', category: 'Languages', url: 'https://www.postgresql.org/' },
  { name: 'Django', category: 'Frameworks', url: 'https://www.djangoproject.com/' },
  { name: 'React', category: 'Frameworks', url: 'https://react.dev/' },
  { name: 'Docker', category: 'DevOps', url: 'https://www.docker.com/' },
  { name: 'Kubernetes', category: 'DevOps', url: 'https://kubernetes.io/' },
  { name: 'Git', category: 'DevOps', url: 'https://git-scm.com/' },
  { name: 'Jenkins', category: 'DevOps', url: 'https://www.jenkins.io/' },
  { name: 'Machine Learning', category: 'Data Science', url: '#' },
  { name: 'Data Pipelines', category: 'Data Science', url: '#' },
  { name: 'Analytics', category: 'Data Science', url: '#' },
  { name: 'HTML5', category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { name: 'CSS3', category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { name: 'TypeScript', category: 'Web', url: 'https://www.typescriptlang.org/' },
]

const expertiseAreas = [
  {
    title: 'Data science and ML',
    description: 'Forecasting, classification, and model deployment.',
  },
  {
    title: 'Process automation',
    description: 'RPA and scripting that take repetitive work off the team.',
  },
  {
    title: 'Full-stack delivery',
    description: 'Django APIs, React frontends, and CI/CD deployment.',
  },
]

const categories = [...new Set(skills.map((skill) => skill.category))]

export default function Skills() {
  return (
    <section className="apple-page pt-28 pb-24">
      <div className="apple-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow mb-6">Skills</p>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h1 className="display-heading text-5xl sm:text-6xl lg:text-7xl">
              What I work with.
            </h1>
            <p className="apple-copy max-w-2xl text-xl">
              Tools I use day to day across data science, automation, and web development.
            </p>
          </div>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {expertiseAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.08, duration: 0.5 }}
              className="border-t hairline pt-6"
            >
              <span className="text-sm text-[#86868b]">0{index + 1}</span>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">{area.title}</h2>
              <p className="apple-copy mt-4">{area.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 divide-y divide-black/10 dark:divide-white/10">
          {categories.map((category) => (
            <section key={category} className="grid gap-6 py-8 md:grid-cols-[220px_1fr]">
              <h2 className="text-lg font-semibold tracking-tight">{category}</h2>
              <div className="flex flex-wrap gap-3">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => {
                    const isPlaceholder = skill.url === '#'

                    return (
                      <a
                        key={skill.name}
                        href={skill.url}
                        target={isPlaceholder ? undefined : '_blank'}
                        rel={isPlaceholder ? undefined : 'noopener noreferrer'}
                        className="rounded-full border hairline px-4 py-2 text-sm text-[#424245] transition-colors hover:bg-white hover:text-[#1d1d1f] dark:text-[#d2d2d7] dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        {skill.name}
                      </a>
                    )
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
