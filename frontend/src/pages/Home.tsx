import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CareerTimeline from '../components/CareerTimeline'
import DataScienceAnimation from '../components/DataScienceAnimation'
import DemoGlyph from '../components/DemoGlyph'
import PlatformStack, { type StackLayer } from '../components/PlatformStack'
import SocialLinks, { CONTACT_EMAIL } from '../components/SocialLinks'
import { demos } from '../data/demos'
import { enterIndex } from '../utils/motion'

const layers: StackLayer[] = [
  {
    title: 'The AI chat interface',
    description: 'The chat interface built into the platform, and the harness that runs it.',
    color: 'var(--signal)',
  },
  {
    title: 'The application',
    description: 'Backend and frontend code for the platform itself.',
    color: 'var(--data-teal)',
  },
  {
    title: 'The Azure infrastructure',
    description: 'All of the cloud infrastructure the platform is hosted on.',
    color: 'var(--data-blue)',
  },
]

export default function Home() {
  return (
    <div className="apple-page">
      <section className="apple-section pb-16 pt-12 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <h1 className="display-heading display-hero">
              <span className="reveal-line">
                <span>Andrew</span>
              </span>
              <span className="reveal-line">
                <span style={enterIndex(1)}>
                  Frankenreider<span className="signal-text">.</span>
                </span>
              </span>
            </h1>
            <p
              className="enter mt-7 inline-flex items-center gap-2.5 rounded-full border hairline py-1.5 pl-2.5 pr-4 text-sm font-medium text-body"
              style={enterIndex(3)}
            >
              <span aria-hidden="true" className="status-dot" />
              Senior Manager, Digital Architecture at Caterpillar
            </p>
            <p className="body-copy enter mt-6 max-w-[56ch] text-lg sm:text-xl" style={enterIndex(4)}>
              I lead the team building Caterpillar's enterprise analytics platform for global finance. We write the application, run the Azure infrastructure under it, and build the AI chat interface people use to work with it.
            </p>
            <div className="enter mt-9 flex flex-wrap items-center gap-3" style={enterIndex(5)}>
              <Link to="/projects" className="quiet-link">
                View work
                <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
              </Link>
              <Link to="/about" className="ghost-link">
                About me
              </Link>
              <SocialLinks className="sm:ml-2" />
            </div>
          </div>

          <div className="enter-visual mx-auto w-full max-w-xl">
            <DataScienceAnimation />
          </div>
        </div>

        <CareerTimeline className="enter mt-16 border-t hairline pt-8 sm:mt-20" style={enterIndex(6)} />
      </section>

      <section className="apple-section pb-24 sm:pb-32">
        <h2 className="display-heading max-w-2xl text-3xl sm:text-5xl">What my team owns</h2>
        <p className="apple-copy mt-4 max-w-[52ch] text-lg">
          The whole platform, from the cloud resources up to the chat window.
        </p>
        <div className="mt-12 sm:mt-16">
          <PlatformStack layers={layers} />
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="apple-section">
          <div className="ink-band relative isolate overflow-hidden rounded-[2rem] px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div aria-hidden="true" className="band-grid absolute inset-0 -z-10" />
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                A few models I built to run in the browser.
              </h2>
              <Link to="/projects" className="quiet-link">
                Open the demos
                <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
              </Link>
            </div>

            <ul className="on-scroll mt-10 grid grid-cols-2 gap-3 sm:mt-12 lg:grid-cols-4 lg:gap-4">
              {demos.map((demo) => (
                <li key={demo.link}>
                  <Link to={demo.link} className="demo-tile group">
                    <DemoGlyph kind={demo.kind} className="demo-tile-glyph" />
                    <span className="flex items-center justify-between gap-2 text-sm font-medium sm:text-base">
                      {demo.title}
                      <ArrowForwardIcon
                        aria-hidden="true"
                        className="shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100 motion-reduce:transition-none"
                        sx={{ fontSize: 16 }}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="apple-section pb-28">
        <div className="grid gap-8 border-t hairline pt-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h2 className="display-heading text-3xl sm:text-5xl">
              Want to talk shop<span className="signal-text">?</span>
            </h2>
            <p className="apple-copy mt-4 max-w-[48ch] text-lg">
              Analytics platforms, data engineering, or any of the demos.
            </p>
          </div>
          <a href={`mailto:${CONTACT_EMAIL}`} className="quiet-link self-start sm:self-end">
            Email me
            <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 17 }} />
          </a>
        </div>
      </section>
    </div>
  )
}
