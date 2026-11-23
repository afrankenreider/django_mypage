import type { ElementType } from 'react'

export interface DemoSection<Id extends string> {
  id: Id
  label: string
  icon: ElementType
}

interface DemoTabsProps<Id extends string> {
  sections: DemoSection<Id>[]
  active: Id
  onChange: (id: Id) => void
}

/**
 * Section switcher for the demo pages. A row of toggle buttons on a sunken
 * track; the active one is filled with Blaze. Scrolls sideways on narrow
 * screens instead of wrapping.
 */
export default function DemoTabs<Id extends string>({ sections, active, onChange }: DemoTabsProps<Id>) {
  return (
    <div className="demo-tabs mb-12" role="group" aria-label="Project sections">
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          key={id}
          onClick={() => onChange(id)}
          aria-pressed={active === id}
          className="demo-tab"
        >
          <Icon aria-hidden="true" sx={{ fontSize: 18 }} />
          {label}
        </button>
      ))}
    </div>
  )
}
