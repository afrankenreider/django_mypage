import type { CSSProperties, ReactElement } from 'react'

export type DemoKind = 'regression' | 'kmeans' | 'neural' | 'finance'

interface DemoGlyphProps {
  kind: DemoKind
  className?: string
}

/** Deterministic pseudo-random sequence so glyphs render the same every time. */
const seeded = (seed: number) => {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function Regression() {
  const random = seeded(7)
  const points = Array.from({ length: 22 }, (_, index) => {
    const x = 14 + (index / 21) * 132
    const y = 92 - (x - 14) * 0.5 + (random() - 0.5) * 30
    return { x, y }
  })
  return (
    <>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="2.6"
          className="pop-in"
          style={{ fill: 'var(--data-blue)', '--enter-index': index * 0.3 } as CSSProperties}
        />
      ))}
      <path
        d="M10 96 L150 26"
        pathLength={1}
        className="draw-in"
        style={{ stroke: 'var(--signal)' }}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

function KMeans() {
  const random = seeded(3)
  const clusters = [
    { cx: 40, cy: 76, color: 'var(--data-blue)' },
    { cx: 116, cy: 84, color: 'var(--data-teal)' },
    { cx: 88, cy: 34, color: 'var(--signal)' },
  ]
  return (
    <>
      {clusters.map((cluster, clusterIndex) =>
        Array.from({ length: 11 }, (_, index) => {
          const angle = random() * Math.PI * 2
          const radius = 9 + random() * 17
          return (
            <circle
              key={`${clusterIndex}-${index}`}
              cx={cluster.cx + Math.cos(angle) * radius}
              cy={cluster.cy + Math.sin(angle) * radius * 0.8}
              r="2.6"
              className="pop-in"
              style={{ fill: cluster.color, '--enter-index': clusterIndex * 2 + index * 0.2 } as CSSProperties}
            />
          )
        }),
      )}
      {clusters.map((cluster, index) => (
        <circle
          key={`c-${index}`}
          cx={cluster.cx}
          cy={cluster.cy}
          r="6"
          fill="none"
          strokeWidth="2"
          className="pop-in"
          style={{ stroke: cluster.color, '--enter-index': 8 + index } as CSSProperties}
        />
      ))}
    </>
  )
}

function Neural() {
  const layers = [
    [30, 60, 90],
    [22, 46, 74, 98],
    [40, 80],
  ]
  const xs = [26, 80, 134]
  const edges: { x1: number; y1: number; x2: number; y2: number; key: string }[] = []
  layers.slice(0, -1).forEach((layer, layerIndex) => {
    layer.forEach((y1, i) => {
      layers[layerIndex + 1].forEach((y2, j) => {
        edges.push({ x1: xs[layerIndex], y1, x2: xs[layerIndex + 1], y2, key: `${layerIndex}-${i}-${j}` })
      })
    })
  })
  const colors = ['var(--data-blue)', 'var(--data-teal)', 'var(--signal)']
  return (
    <>
      {edges.map((edge, index) => (
        <line
          key={edge.key}
          x1={edge.x1}
          y1={edge.y1}
          x2={edge.x2}
          y2={edge.y2}
          pathLength={1}
          className="draw-in"
          strokeWidth="1"
          style={{ stroke: 'var(--text-secondary)', strokeOpacity: 0.45, '--enter-index': index * 0.15 } as CSSProperties}
        />
      ))}
      {layers.map((layer, layerIndex) =>
        layer.map((y, index) => (
          <circle
            key={`${layerIndex}-${index}`}
            cx={xs[layerIndex]}
            cy={y}
            r="7"
            className="pop-in"
            style={{ fill: colors[layerIndex], '--enter-index': layerIndex * 2 + index * 0.3 } as CSSProperties}
          />
        )),
      )}
    </>
  )
}

function Finance() {
  const random = seeded(11)
  let price = 88
  const candles = Array.from({ length: 12 }, (_, index) => {
    const open = price
    const close = price - 4.5 + (random() - 0.5) * 22
    price = close
    const high = Math.min(open, close) - 3 - random() * 7
    const low = Math.max(open, close) + 3 + random() * 7
    return { x: 18 + index * 11.5, open, close, high, low }
  })
  return (
    <>
      {candles.map((candle, index) => {
        const up = candle.close < candle.open
        const color = up ? 'var(--data-teal)' : 'var(--signal)'
        return (
          <g key={index} className="pop-in" style={{ '--enter-index': index * 0.4 } as CSSProperties}>
            <line x1={candle.x} x2={candle.x} y1={candle.high} y2={candle.low} strokeWidth="1.25" style={{ stroke: color }} />
            <rect
              x={candle.x - 3.5}
              y={Math.min(candle.open, candle.close)}
              width="7"
              height={Math.max(2, Math.abs(candle.close - candle.open))}
              rx="1"
              style={{ fill: color }}
            />
          </g>
        )
      })}
      <path
        d={`M${candles.map((candle) => `${candle.x} ${(candle.open + candle.close) / 2 - 2}`).join(' L')}`}
        pathLength={1}
        className="draw-in"
        fill="none"
        strokeWidth="1.5"
        strokeLinejoin="round"
        style={{ stroke: 'var(--data-blue)' }}
      />
    </>
  )
}

const GLYPHS: Record<DemoKind, () => ReactElement> = {
  regression: Regression,
  kmeans: KMeans,
  neural: Neural,
  finance: Finance,
}

/** A small, decorative illustration of each demo. */
export default function DemoGlyph({ kind, className = '' }: DemoGlyphProps) {
  const Glyph = GLYPHS[kind]
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <Glyph />
    </svg>
  )
}
