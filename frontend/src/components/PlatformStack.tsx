import { enterIndex } from '../utils/motion'

export interface StackLayer {
  title: string
  description: string
  /** CSS color for the layer, normally a data token. */
  color: string
}

interface PlatformStackProps {
  /** Layers from the top of the stack down. */
  layers: StackLayer[]
}

const CENTER = 150
const HALF_WIDTH = 120
const HALF_DEPTH = 60
const THICKNESS = 16
const GAP = 88
const TOP = 46

const shade = (color: string, amount: number) => `color-mix(in oklab, ${color} ${100 - amount}%, black)`

function Plate({ y, color, index }: { y: number; color: string; index: number }) {
  const top = [
    [CENTER, y],
    [CENTER + HALF_WIDTH, y + HALF_DEPTH],
    [CENTER, y + HALF_DEPTH * 2],
    [CENTER - HALF_WIDTH, y + HALF_DEPTH],
  ]
  const left = [
    [CENTER - HALF_WIDTH, y + HALF_DEPTH],
    [CENTER, y + HALF_DEPTH * 2],
    [CENTER, y + HALF_DEPTH * 2 + THICKNESS],
    [CENTER - HALF_WIDTH, y + HALF_DEPTH + THICKNESS],
  ]
  const right = [
    [CENTER, y + HALF_DEPTH * 2],
    [CENTER + HALF_WIDTH, y + HALF_DEPTH],
    [CENTER + HALF_WIDTH, y + HALF_DEPTH + THICKNESS],
    [CENTER, y + HALF_DEPTH * 2 + THICKNESS],
  ]
  const inset = 0.55
  const inner = top.map(([x, py]) => [
    CENTER + (x - CENTER) * inset,
    y + HALF_DEPTH + (py - y - HALF_DEPTH) * inset,
  ])
  const points = (list: number[][]) => list.map(([x, py]) => `${x},${py}`).join(' ')

  return (
    <g className="drop-in" style={enterIndex(index)}>
      <polygon points={points(left)} style={{ fill: shade(color, 28) }} />
      <polygon points={points(right)} style={{ fill: shade(color, 42) }} />
      <polygon points={points(top)} style={{ fill: color }} />
      <polygon points={points(inner)} fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="1.25" />
    </g>
  )
}

/**
 * The platform as a physical stack: one isometric plate per layer, colored
 * to match the list beside it. The SVG is decorative; the list is the content.
 */
export default function PlatformStack({ layers }: PlatformStackProps) {
  const height = TOP + GAP * (layers.length - 1) + HALF_DEPTH * 2 + THICKNESS + 8
  // Draw the bottom plate first so upper plates overlap it.
  const drawOrder = layers.map((layer, index) => ({ layer, index })).reverse()

  return (
    <div className="on-scroll grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <svg
        viewBox={`0 0 300 ${height}`}
        className="mx-auto w-full max-w-[16rem] sm:max-w-[22rem]"
        aria-hidden="true"
      >
        <text
          x={CENTER}
          y="12"
          textAnchor="middle"
          className="fill-[var(--text-secondary)] text-[11px] font-medium"
        >
          finance users
        </text>
        <line
          x1={CENTER}
          y1="20"
          x2={CENTER}
          y2={TOP + HALF_DEPTH - 4}
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="flow-dash"
        />
        {drawOrder.map(({ layer, index }) => (
          <Plate
            key={layer.title}
            y={TOP + GAP * index}
            color={layer.color}
            index={layers.length - 1 - index}
          />
        ))}
      </svg>

      <ol className="divide-y divide-[var(--hairline)] border-y hairline">
        {layers.map((layer, index) => (
          <li key={layer.title} className="scroll-reveal grid grid-cols-[auto_1fr] gap-x-5 py-7" style={enterIndex(index)}>
            <span
              aria-hidden="true"
              className="mt-2 h-3 w-3 rotate-45 rounded-[3px]"
              style={{ background: layer.color }}
            />
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">{layer.title}</h3>
              <p className="apple-copy mt-2 max-w-[48ch]">{layer.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
