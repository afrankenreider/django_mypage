import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { CONTACT_EMAIL } from '../components/SocialLinks'
import DemoGlyph from '../components/DemoGlyph'
import { demos } from '../data/demos'
import { enterIndex } from '../utils/motion'

export default function Projects() {
  return (
    <div className="apple-page pb-24 pt-14 sm:pt-16">
      <div className="apple-section">
        <header className="enter grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-10">
          <h1 className="display-heading display-page">Projects<span className="signal-text">.</span></h1>
          <p className="apple-copy max-w-xl text-lg sm:text-xl lg:pb-1">
            Small demos that run in your browser and call a Django API for the math.
          </p>
        </header>

        <ul className="enter mt-14 border-t hairline sm:mt-20" style={enterIndex(1)}>
          {demos.map((project) => (
            <li key={project.title} className="border-b hairline">
              <article className="group relative grid gap-x-10 gap-y-5 py-9 sm:grid-cols-[11rem_1fr] sm:py-11 lg:grid-cols-[13rem_0.9fr_1.1fr]">
                <div className="project-glyph max-sm:max-w-[13rem]">
                  <DemoGlyph kind={project.kind} className="h-full w-full" />
                </div>
                <div>
                  <h2 className="display-heading text-3xl sm:text-4xl">
                    {/* The link's pseudo-element stretches over the row, so the whole row is the target. */}
                    <Link
                      to={project.link}
                      className="rounded-sm after:absolute after:inset-0 after:content-['']"
                    >
                      {project.title}
                    </Link>
                  </h2>
                  <p className="eyebrow mt-3">{project.category}</p>
                </div>

                <div className="sm:col-start-2 lg:col-start-auto">
                  <p className="apple-copy max-w-[60ch] text-base sm:text-lg">{project.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-body">
                    {project.capabilities.map((capability) => (
                      <li key={capability}>{capability}</li>
                    ))}
                  </ul>
                  <p className="text-link mt-6 group-hover:underline" aria-hidden="true">
                    Open demo
                    <ArrowForwardIcon
                      className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      sx={{ fontSize: 17 }}
                    />
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted">Built with React and TypeScript.</p>

        <div className="mt-16 flex flex-col gap-6 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight">
            Questions about how any of these work?
          </h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className="quiet-link self-start">
            Email me
            <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
          </a>
        </div>
      </div>
    </div>
  )
}
