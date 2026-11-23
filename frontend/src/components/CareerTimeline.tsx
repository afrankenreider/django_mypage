import type { CSSProperties } from 'react'
import { enterIndex } from '../utils/motion'

interface Role {
  title: string
  company: Company
  /** Start month, as `YYYY-MM`. */
  start: string
}

type Company = 'C.H. Robinson' | 'Caterpillar'

const COMPANY_COLOR: Record<Company, string> = {
  'C.H. Robinson': 'var(--data-blue)',
  Caterpillar: 'var(--signal)',
}

const roles: Role[] = [
  { title: 'Data Analyst', company: 'C.H. Robinson', start: '2018-06' },
  { title: 'Senior Data Analyst', company: 'C.H. Robinson', start: '2021-04' },
  { title: 'Data Scientist', company: 'C.H. Robinson', start: '2021-10' },
  { title: 'Data Scientist', company: 'Caterpillar', start: '2023-04' },
  { title: 'Manager, Analytics', company: 'Caterpillar', start: '2024-05' },
  { title: 'Senior Manager, Digital Architecture', company: 'Caterpillar', start: '2026-08' },
]

const toMonths = (value: string) => {
  const [year, month] = value.split('-').map(Number)
  return year * 12 + (month - 1)
}

const START = toMonths(roles[0].start)

interface CareerTimelineProps {
  className?: string
  style?: CSSProperties
}

/**
 * A single bar from the first role to today, colored by company, with a
 * tick at each role change. Decorative summary: the role list on the page
 * carries the same facts as text.
 */
export default function CareerTimeline({ className = '', style }: CareerTimelineProps) {
  const now = new Date()
  const end = now.getFullYear() * 12 + now.getMonth() + 1
  const span = end - START
  const pct = (months: number) => `${((months - START) / span) * 100}%`
  const years = Array.from(
    { length: Math.floor(end / 12) - Math.ceil(START / 12) + 1 },
    (_, index) => Math.ceil(START / 12) + index,
  )

  const companies = (['C.H. Robinson', 'Caterpillar'] as const).map((company) => {
    const companyRoles = roles.filter((role) => role.company === company)
    const first = toMonths(companyRoles[0].start)
    const nextIndex = roles.indexOf(companyRoles[companyRoles.length - 1]) + 1
    const last = nextIndex < roles.length ? toMonths(roles[nextIndex].start) : end
    return { company, first, last }
  })

  const totalYears = Math.floor(span / 12)

  return (
    <figure className={className} style={style}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="display-heading text-2xl">
          {totalYears} years, two companies, six roles
        </span>
        <span className="flex gap-5 text-sm text-body">
          {companies.map(({ company }) => (
            <span key={company} className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: COMPANY_COLOR[company] }}
              />
              {company}
            </span>
          ))}
        </span>
      </figcaption>

      <div aria-hidden="true" className="relative mt-6 h-16">
        {/* Track */}
        <div className="absolute inset-x-0 top-4 h-3 rounded-full" style={{ background: 'var(--hairline)' }} />
        {/* Company segments */}
        {companies.map(({ company, first, last }, index) => (
          <div
            key={company}
            className="grow-x absolute top-4 h-3 rounded-full"
            style={{
              ...enterIndex(index),
              left: pct(first),
              width: `calc(${pct(last)} - ${pct(first)} - 3px)`,
              background: COMPANY_COLOR[company],
            }}
          />
        ))}
        {/* Role changes */}
        {roles.slice(1).map((role, index) => (
          <span
            key={`${role.title}-${role.start}`}
            className="pop-in absolute top-3 h-5 w-[3px] -translate-x-1/2 rounded-full"
            style={{ ...enterIndex(index + 3), left: pct(toMonths(role.start)), background: 'var(--page-bg)' }}
          />
        ))}
        {/* Today: a flagstick on the green. */}
        <svg
          viewBox="0 0 22 40"
          className="pop-in absolute -right-1 -top-5 h-10 w-[1.375rem] overflow-visible"
          style={enterIndex(10)}
        >
          <ellipse cx="3" cy="35.5" rx="4.5" ry="1.6" style={{ fill: 'var(--data-teal)', opacity: 0.45 }} />
          <line x1="3" y1="35" x2="3" y2="3" strokeWidth="1.75" strokeLinecap="round" style={{ stroke: 'var(--text-primary)' }} />
          <path d="M3.9 3 L20 8.5 L3.9 14 Z" className="flag-wave" style={{ fill: 'var(--signal)' }} />
        </svg>
        {/* Year ticks */}
        {years.map((year) => (
          <span
            key={year}
            className={`absolute top-10 -translate-x-1/2 text-xs tabular-nums text-muted ${year % 2 === 1 ? 'max-sm:hidden' : ''}`}
            style={{ left: pct(year * 12) }}
          >
            {year}
          </span>
        ))}
      </div>
    </figure>
  )
}
