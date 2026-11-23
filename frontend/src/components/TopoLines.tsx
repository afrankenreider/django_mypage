import type { CSSProperties } from 'react'

interface Peak {
  cx: number
  cy: number
  rings: number
  spacing: number
  seed: number
}

const PEAKS: Peak[] = [
  { cx: 860, cy: 150, rings: 9, spacing: 30, seed: 1.3 },
  { cx: 1120, cy: 430, rings: 6, spacing: 26, seed: 4.1 },
  { cx: 180, cy: 520, rings: 5, spacing: 28, seed: 2.7 },
]

/** Closed, smooth contour ring: a wobbly circle through Catmull-Rom points. */
function ring(peak: Peak, index: number): string {
  const steps = 48
  const base = 18 + peak.spacing * (index + 1)
  const points = Array.from({ length: steps }, (_, step) => {
    const angle = (step / steps) * Math.PI * 2
    const wobble =
      1 +
      0.16 * Math.sin(3 * angle + peak.seed + index * 0.22) +
      0.07 * Math.sin(5 * angle - peak.seed * 1.7 + index * 0.35) +
      0.04 * Math.sin(8 * angle + index)
    const radius = base * wobble
    return [peak.cx + Math.cos(angle) * radius * 1.35, peak.cy + Math.sin(angle) * radius]
  })
  const at = (i: number) => points[(i + steps) % steps]
  let d = `M${at(0)[0].toFixed(1)} ${at(0)[1].toFixed(1)}`
  for (let i = 0; i < steps; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return `${d}Z`
}

/**
 * Topographic contour texture for the spruce band, in the spirit of a
 * Teton trail map. Every fifth ring is an index contour, drawn heavier.
 * Decorative only.
 */
export default function TopoLines({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1280 640"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      {PEAKS.map((peak) =>
        Array.from({ length: peak.rings }, (_, index) => (
          <path
            key={`${peak.cx}-${index}`}
            d={ring(peak, index)}
            pathLength={1}
            fill="none"
            className="draw-in"
            strokeWidth={index % 5 === 4 ? 1.6 : 0.9}
            style={
              {
                stroke: index % 5 === 4 ? 'var(--band-muted)' : 'var(--band-line)',
                strokeOpacity: index % 5 === 4 ? 0.35 : 1,
                '--enter-index': index * 0.6,
              } as CSSProperties
            }
          />
        )),
      )}
    </svg>
  )
}
