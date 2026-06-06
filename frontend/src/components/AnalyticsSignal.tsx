import { motion } from 'framer-motion'

type AnalyticsSignalProps = {
  title?: string
  caption?: string
}

const bars = [44, 66, 52, 78, 62, 88, 72, 96]
const path = 'M16 118 C58 104 72 92 108 96 C151 101 163 58 210 64 C252 69 269 40 320 32'

export default function AnalyticsSignal({
  title = 'Live analytics system',
  caption = 'Signals, model health, and delivery velocity in one calm workspace.',
}: AnalyticsSignalProps) {
  return (
    <div className="apple-card relative overflow-hidden">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="eyebrow">Signal room</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h3>
          <p className="apple-copy mt-3 max-w-sm text-sm">{caption}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border hairline px-3 py-1 text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1d1d1f] dark:bg-[#f5f5f7]" />
          Live
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border hairline bg-white/65 p-4 dark:bg-white/[0.055]">
          <svg viewBox="0 0 336 150" className="h-44 w-full" role="img" aria-label="Animated analytics signal line">
            {[30, 60, 90, 120].map((y) => (
              <line key={y} x1="0" y1={y} x2="336" y2={y} stroke="currentColor" className="text-black/10 dark:text-white/10" />
            ))}
            <motion.path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-[#1d1d1f] dark:text-[#f5f5f7]"
              initial={{ pathLength: 0, opacity: 0.35 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            {[24, 109, 209, 319].map((x, index) => (
              <motion.circle
                key={x}
                cx={x}
                cy={[116, 96, 64, 33][index]}
                r="4"
                fill="currentColor"
                className="text-[#1d1d1f] dark:text-[#f5f5f7]"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + index * 0.12, duration: 0.35 }}
              />
            ))}
          </svg>
        </div>

        <div className="grid gap-3">
          {[
            ['Throughput', '142', '82%'],
            ['Forecast', '91%', '91%'],
            ['Latency', '0.8s', '38%'],
          ].map(([label, value, width]) => (
            <div key={label} className="metric-tile">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-[#86868b]">{label}</span>
                <span className="text-xl font-semibold tracking-tight">{value}</span>
              </div>
              <div className="signal-strip mt-4">
                <span style={{ width }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-end gap-2 border-t hairline pt-5">
        {bars.map((height, index) => (
          <motion.div
            key={height + index}
            className="flex-1 rounded-full bg-[#1d1d1f]/75 dark:bg-[#f5f5f7]/80"
            style={{ height }}
            initial={{ scaleY: 0.35, opacity: 0.4 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.45, ease: 'easeOut' }}
          />
        ))}
      </div>
    </div>
  )
}
