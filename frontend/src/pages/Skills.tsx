import { usePageTitle } from '../hooks/usePageTitle'
import { enterIndex } from '../utils/motion'

interface Skill {
  name: string
  category: string
  /** Reference site for the tool. Omitted for general disciplines. */
  url?: string
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
  { name: 'Machine Learning', category: 'Data Science' },
  { name: 'Data Pipelines', category: 'Data Science' },
  { name: 'Analytics', category: 'Data Science' },
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

const chipClass = 'inline-flex min-h-11 items-center rounded-full border px-4 text-sm text-body'

export default function Skills() {
  usePageTitle('Skills')

  return (
    <div className="apple-page pb-24 pt-14 sm:pt-16">
      <div className="apple-section">
        <header className="enter grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-10">
          <h1 className="display-heading display-page">What I work with.</h1>
          <p className="apple-copy max-w-2xl text-xl">
            Tools I use day to day across data science, automation, and web development.
          </p>
        </header>

        <ul className="enter mt-14 grid gap-x-10 sm:mt-20 md:grid-cols-3" style={enterIndex(1)}>
          {expertiseAreas.map((area) => (
            <li key={area.title} className="border-t hairline py-6">
              <h2 className="text-2xl font-semibold tracking-tight">{area.title}</h2>
              <p className="apple-copy mt-3 max-w-[40ch]">{area.description}</p>
            </li>
          ))}
        </ul>

        <div className="enter mt-10 divide-y divide-[var(--hairline)] border-t hairline sm:mt-14" style={enterIndex(2)}>
          {categories.map((category) => (
            <section key={category} className="grid gap-4 py-7 md:grid-cols-[220px_1fr] md:gap-6">
              <h2 className="text-lg font-semibold tracking-tight md:pt-2">{category}</h2>
              <ul className="flex flex-wrap gap-2.5">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <li key={skill.name}>
                      {skill.url ? (
                        <a
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${chipClass} border-control transition-colors hover:bg-[var(--hover)] hover:text-ink`}
                        >
                          {skill.name}
                          <span className="visually-hidden"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <span className={`${chipClass} border-[var(--hairline)]`}>{skill.name}</span>
                      )}
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
