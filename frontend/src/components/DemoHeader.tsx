import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DemoGlyph, { type DemoKind } from './DemoGlyph'
import TopoLines from './TopoLines'
import { demos } from '../data/demos'
import { enterIndex } from '../utils/motion'

interface DemoHeaderProps {
  kind: DemoKind
  /** One or two sentences under the title. */
  lede: string
  /** Extra controls for the header, such as a refresh button. */
  actions?: ReactNode
}

/**
 * Shared opening for every demo page: a Spruce band with the demo's
 * category, a serif title, its lede, and a large version of its glyph over
 * faint contour lines.
 */
export default function DemoHeader({ kind, lede, actions }: DemoHeaderProps) {
  const demo = demos.find((item) => item.kind === kind)
  const title = demo?.title ?? ''

  return (
    <header className="ink-band enter relative isolate mb-8 overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
      <TopoLines className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" />

      <Link to="/projects" className="text-link group text-sm">
        <ArrowBackIcon
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
          sx={{ fontSize: 18 }}
        />
        All projects
      </Link>

      <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-12">
        <div>
          {demo && (
            <p className="enter text-sm font-medium text-cedar" style={enterIndex(1)}>
              {demo.category}
            </p>
          )}
          <h1 className="display-heading display-page mt-3">
            <span className="reveal-line">
              <span style={enterIndex(1)}>
                {title}
                <span className="signal-text">.</span>
              </span>
            </span>
          </h1>
          <p className="enter mt-5 max-w-[56ch] text-lg text-[var(--band-muted)]" style={enterIndex(3)}>
            {lede}
          </p>
          {actions && (
            <div className="enter mt-7 flex flex-wrap items-center gap-3" style={enterIndex(4)}>
              {actions}
            </div>
          )}
        </div>

        <div className="demo-hero-glyph enter-visual mx-auto w-full max-w-[18rem] max-sm:hidden lg:max-w-none">
          <DemoGlyph kind={kind} className="h-full w-full" />
        </div>
      </div>
    </header>
  )
}
