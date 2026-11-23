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
  { name: 'JavaScript', category: 'Languages', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'TypeScript', category: 'Languages', url: 'https://www.typescriptlang.org/' },
  { name: 'Django', category: 'Web', url: 'https://www.djangoproject.com/' },
  { name: 'FastAPI', category: 'Web', url: 'https://fastapi.tiangolo.com/' },
  { name: 'React', category: 'Web', url: 'https://react.dev/' },
  { name: 'HTML', category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { name: 'CSS', category: 'Web', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  { name: 'Airflow', category: 'Data', url: 'https://airflow.apache.org/' },
  { name: 'dbt', category: 'Data', url: 'https://www.getdbt.com/' },
  { name: 'Snowflake', category: 'Data', url: 'https://www.snowflake.com/' },
  { name: 'PostgreSQL', category: 'Data', url: 'https://www.postgresql.org/' },
  { name: 'Power BI', category: 'Data', url: 'https://www.microsoft.com/en-us/power-platform/products/power-bi' },
  { name: 'Azure', category: 'Infrastructure', url: 'https://azure.microsoft.com/' },
  { name: 'Docker', category: 'Infrastructure', url: 'https://www.docker.com/' },
  { name: 'Kubernetes', category: 'Infrastructure', url: 'https://kubernetes.io/' },
  { name: 'Linux', category: 'Infrastructure', url: 'https://www.kernel.org/' },
  { name: 'Git', category: 'Infrastructure', url: 'https://git-scm.com/' },
  { name: 'Jenkins', category: 'Infrastructure', url: 'https://www.jenkins.io/' },
]

const expertiseAreas = [
  {
    title: 'Platforms',
    description: 'Web apps and APIs in Django and FastAPI, deployed on Azure with Docker and Kubernetes.',
  },
  {
    title: 'Data engineering',
    description: 'Pipelines in Airflow and dbt feeding Snowflake and PostgreSQL.',
  },
  {
    title: 'Analytics and ML',
    description: 'Power BI reporting, statistical models, and the code to put models into production.',
  },
]

const categories = [...new Set(skills.map((skill) => skill.category))]

const chipClass = 'inline-flex min-h-11 items-center rounded-full border px-4 text-sm text-body'

export default function Skills() {
  return (
    <div className="apple-page pb-24 pt-14 sm:pt-16">
      <div className="apple-section">
        <header className="enter grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-10">
          <h1 className="display-heading display-page">Skills.</h1>
          <p className="apple-copy max-w-2xl text-xl">
            The languages and tools I've used to ship real work.
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
