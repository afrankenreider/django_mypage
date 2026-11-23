import { Link } from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CareerTimeline from '../components/CareerTimeline'
import DataScienceAnimation from '../components/DataScienceAnimation'
import DemoGlyph from '../components/DemoGlyph'
import PlatformStack, { type StackLayer } from '../components/PlatformStack'
import SocialLinks, { CONTACT_EMAIL } from '../components/SocialLinks'
import TopoLines from '../components/TopoLines'
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
      <section className="apple-section pb-16 pt-14 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="eyebrow enter" style={enterIndex(0)}>
              Senior Manager, Digital Architecture &middot; Caterpillar
            </p>
            <h1 className="display-heading display-hero mt-5">
              <span className="reveal-line">
                <span style={enterIndex(1)}>Andrew</span>
              </span>
              <span className="reveal-line">
                <span style={enterIndex(2)}>
                  Frankenreider<span className="signal-text">.</span>
                </span>
              </span>
            </h1>
            <p className="body-copy enter mt-7 max-w-[54ch] text-lg" style={enterIndex(4)}>
              I lead the team building Caterpillar's enterprise analytics platform for global finance. We write the application, run the Azure infrastructure under it, and build the AI chat interface people use to work with it.
            </p>
            <div className="enter mt-10 flex flex-wrap items-center gap-x-7 gap-y-4" style={enterIndex(5)}>
              <Link to="/projects" className="quiet-link">
                View work
                <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 16 }} />
              </Link>
              <Link to="/about" className="ghost-link">
                About me
              </Link>
              <SocialLinks />
            </div>
          </div>

          <div className="enter-visual mx-auto w-full max-w-xl">
            <DataScienceAnimation />
          </div>
        </div>

        <CareerTimeline className="enter mt-16 border-t hairline pt-8 sm:mt-24" style={enterIndex(6)} />
      </section>

      <section className="apple-section pb-24 sm:pb-32">
        <p className="eyebrow">The platform</p>
        <h2 className="display-heading mt-4 max-w-2xl text-4xl sm:text-[3.25rem]">What my team owns</h2>
        <p className="apple-copy mt-4 max-w-[52ch] text-lg">
          The whole platform, from the cloud resources up to the chat window.
        </p>
        <div className="mt-12 sm:mt-16">
          <PlatformStack layers={layers} />
        </div>
      </section>

      <section className="ink-band on-scroll relative isolate overflow-hidden">
        <TopoLines className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
        <div className="apple-section py-20 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="eyebrow">Side projects</p>
              <h2 className="display-heading mt-4 max-w-xl text-4xl sm:text-[3.25rem]">
                A few models I built to run in the browser.
              </h2>
            </div>
            <Link to="/projects" className="quiet-link">
              Open the demos
              <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 16 }} />
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 lg:grid-cols-4 lg:gap-5">
            {demos.map((demo) => (
              <li key={demo.link}>
                <Link to={demo.link} className="demo-tile group">
                  <DemoGlyph kind={demo.kind} className="demo-tile-glyph" />
                  <span className="flex items-center justify-between gap-2 font-display text-lg sm:text-xl">
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
      </section>

      <section className="apple-section py-24 text-center sm:py-32">
        <h2 className="display-heading text-4xl sm:text-[3.25rem]">Want to talk shop?</h2>
        <p className="apple-copy mx-auto mt-4 max-w-[44ch] text-lg">
          Analytics platforms, data engineering, or any of the demos.
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="quiet-link mt-9">
          Email me
          <ArrowForwardIcon aria-hidden="true" sx={{ fontSize: 16 }} />
        </a>
      </section>
    </div>
  )
}
