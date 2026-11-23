import { useEffect, useRef, useState } from 'react'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useTheme } from '../context/ThemeContext'
import { DATA_PALETTE } from '../utils/palette'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const CLUSTER_KEYS = ['blue', 'teal', 'amber'] as const
/** How often the centroids re-fit, in milliseconds. */
const REFIT_INTERVAL = 3800

type ClusterKey = (typeof CLUSTER_KEYS)[number]

type Point = {
  x: number
  y: number
  /** Offset from the cluster centroid the point orbits. */
  dx: number
  dy: number
  cluster: number
  phase: number
  /** Seconds after start when the point appears. */
  delay: number
}

type Centroid = { x: number; y: number; tx: number; ty: number }

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

/**
 * Home hero visual: a live k-means view. Three clusters drift around their
 * centroids, the centroids re-fit every few seconds, and a trend line runs
 * through all of it. Static for reduced motion, with a play control.
 */
export default function DataScienceAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const pointsRef = useRef<Point[]>([])
  const centroidsRef = useRef<Centroid[]>([])
  const seededSizeRef = useRef('')
  const startRef = useRef<number | null>(null)
  const lastRefitRef = useRef(0)
  const { theme } = useTheme()
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const palette = DATA_PALETTE[theme]
    const clusterColor = (index: number) => palette[CLUSTER_KEYS[index] as ClusterKey]
    let isVisible = true

    const seed = (width: number, height: number) => {
      const anchors = [
        { x: 0.26, y: 0.66 },
        { x: 0.52, y: 0.44 },
        { x: 0.78, y: 0.28 },
      ]
      centroidsRef.current = anchors.map(({ x, y }) => ({
        x: x * width,
        y: y * height,
        tx: x * width,
        ty: y * height,
      }))
      const count = width < 520 ? 42 : 66
      const spread = Math.min(width, height) * 0.13
      pointsRef.current = Array.from({ length: count }, (_, index) => {
        const cluster = index % 3
        const angle = Math.random() * Math.PI * 2
        const radius = Math.sqrt(Math.random()) * spread
        const centroid = centroidsRef.current[cluster]
        const dx = Math.cos(angle) * radius
        const dy = Math.sin(angle) * radius * 0.8
        return {
          x: centroid.x + dx,
          y: centroid.y + dy,
          dx,
          dy,
          cluster,
          phase: Math.random() * Math.PI * 2,
          delay: 0.15 + (index / count) * 0.9,
        }
      })
    }

    const refit = (width: number, height: number) => {
      const jitter = Math.min(width, height) * 0.06
      centroidsRef.current.forEach((centroid, index) => {
        const base = [0.26, 0.52, 0.78][index]
        const baseY = [0.66, 0.44, 0.28][index]
        centroid.tx = base * width + (Math.random() - 0.5) * jitter * 2
        centroid.ty = baseY * height + (Math.random() - 0.5) * jitter * 2
      })
    }

    const draw = (now = performance.now()) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (startRef.current === null) startRef.current = now
      // Without playback, render the settled end state.
      const elapsed = isPlaying ? (now - startRef.current) / 1000 : 10

      context.clearRect(0, 0, width, height)

      // Chart grid.
      context.fillStyle = `rgba(${palette.grid}, ${theme === 'dark' ? 0.05 : 0.04})`
      for (let x = 32; x < width; x += 40) context.fillRect(x, 24, 1, height - 48)
      for (let y = 32; y < height; y += 40) context.fillRect(24, y, width - 48, 1)

      if (isPlaying && now - lastRefitRef.current > REFIT_INTERVAL) {
        lastRefitRef.current = now
        if (elapsed > 2) refit(width, height)
      }

      centroidsRef.current.forEach((centroid) => {
        centroid.x += (centroid.tx - centroid.x) * 0.025
        centroid.y += (centroid.ty - centroid.y) * 0.025
      })

      // Points, with faint spokes to their centroid.
      pointsRef.current.forEach((point) => {
        const appear = easeOutExpo(Math.max(0, (elapsed - point.delay) / 0.8))
        if (appear <= 0) return
        const centroid = centroidsRef.current[point.cluster]
        if (isPlaying) point.phase += 0.012
        const targetX = centroid.x + point.dx + Math.cos(point.phase) * 3
        const targetY = centroid.y + point.dy + Math.sin(point.phase * 1.3) * 3
        point.x += (targetX - point.x) * 0.08
        point.y += (targetY - point.y) * 0.08

        const color = clusterColor(point.cluster)
        context.beginPath()
        context.moveTo(centroid.x, centroid.y)
        context.lineTo(point.x, point.y)
        context.strokeStyle = `rgba(${color}, ${0.12 * appear})`
        context.lineWidth = 1
        context.stroke()

        context.beginPath()
        context.arc(point.x, point.y, 3.2 * appear, 0, Math.PI * 2)
        context.fillStyle = `rgba(${color}, ${0.85 * appear})`
        context.fill()
      })

      // Centroids: a ring and a cross.
      centroidsRef.current.forEach((centroid, index) => {
        const appear = easeOutExpo(Math.max(0, (elapsed - 1.1 - index * 0.12) / 0.7))
        if (appear <= 0) return
        const color = clusterColor(index)
        context.beginPath()
        context.arc(centroid.x, centroid.y, 9 * appear, 0, Math.PI * 2)
        context.strokeStyle = `rgba(${color}, 1)`
        context.lineWidth = 2
        context.stroke()
        context.beginPath()
        context.arc(centroid.x, centroid.y, 16 * appear, 0, Math.PI * 2)
        context.fillStyle = `rgba(${color}, 0.12)`
        context.fill()
      })

      // Trend line through the centroids, drawn left to right on load.
      const lineProgress = easeOutExpo(Math.max(0, (elapsed - 0.6) / 1.4))
      if (lineProgress > 0) {
        const [first, , last] = centroidsRef.current
        const slope = (last.y - first.y) / (last.x - first.x)
        const x0 = 28
        const y0 = first.y + slope * (x0 - first.x)
        const x1 = x0 + (width - 56) * lineProgress
        const y1 = first.y + slope * (x1 - first.x)
        context.beginPath()
        context.moveTo(x0, y0)
        context.lineTo(x1, y1)
        context.strokeStyle = `rgba(${palette.signal}, 0.95)`
        context.lineWidth = 2
        context.stroke()
      }

      // Labels.
      context.font = '500 12px system-ui, -apple-system, "Segoe UI", sans-serif'
      context.fillStyle = `rgba(${palette.ink}, 0.85)`
      context.fillText('k-means, k = 3', 28, 36)
      const legendY = height - 30
      CLUSTER_KEYS.forEach((_, index) => {
        const x = width - 112 + index * 30
        context.beginPath()
        context.arc(x, legendY - 4, 4, 0, Math.PI * 2)
        context.fillStyle = `rgba(${clusterColor(index)}, 1)`
        context.fill()
      })
      context.fillStyle = `rgba(${palette.signal}, 1)`
      context.fillRect(width - 28 - 18, 30, 18, 2)
      context.fillStyle = `rgba(${palette.muted}, 1)`
      context.textAlign = 'right'
      context.fillText('trend', width - 52, 36)
      context.textAlign = 'left'

      if (isPlaying && isVisible) {
        animationRef.current = requestAnimationFrame(draw)
      }
    }

    const restart = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      draw()
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const size = `${rect.width}x${rect.height}`
      if (seededSizeRef.current !== size) {
        seededSizeRef.current = size
        seed(rect.width, rect.height)
      }
      restart()
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible
      isVisible = entry.isIntersecting
      if (isVisible && !wasVisible) restart()
    })
    const resizeObserver = new ResizeObserver(resize)

    resize()
    visibilityObserver.observe(canvas)
    resizeObserver.observe(canvas)

    return () => {
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [theme, isPlaying])

  return (
    <div className="hero-visual relative h-80 overflow-hidden rounded-[2rem] border hairline sm:h-[26rem]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setIsPlaying((playing) => !playing)}
        className="icon-button absolute bottom-3 left-3"
      >
        {isPlaying ? (
          <PauseIcon aria-hidden="true" sx={{ fontSize: 18 }} />
        ) : (
          <PlayArrowIcon aria-hidden="true" sx={{ fontSize: 18 }} />
        )}
        <span className="visually-hidden">{isPlaying ? 'Pause animation' : 'Play animation'}</span>
      </button>
    </div>
  )
}
