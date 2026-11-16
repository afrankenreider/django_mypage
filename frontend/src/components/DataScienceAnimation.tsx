import { useEffect, useRef, useState } from 'react'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useTheme } from '../context/ThemeContext'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type Point = {
  x: number
  y: number
  vx: number
  vy: number
  phase: number
}

export default function DataScienceAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const pointsRef = useRef<Point[]>([])
  const seededSizeRef = useRef('')
  const { theme } = useTheme()
  // Static by default for visitors who ask for reduced motion; they can opt in.
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia(REDUCED_MOTION_QUERY).matches,
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const isDark = theme === 'dark'
    const ink = isDark ? '245, 245, 247' : '29, 29, 31'
    const muted = isDark ? '161, 161, 166' : '110, 110, 115'
    let isVisible = true

    const seedPoints = (width: number, height: number) => {
      pointsRef.current = Array.from({ length: width < 520 ? 34 : 52 }, (_, index) => {
        const baseX = 28 + Math.random() * (width - 56)
        const trend = height * 0.72 - (baseX / width) * height * 0.42
        return {
          x: baseX,
          y: trend + (Math.random() - 0.5) * height * 0.26,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          phase: index * 0.45,
        }
      })
    }

    const draw = (time = 0) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)

      context.fillStyle = `rgba(${ink}, ${isDark ? 0.04 : 0.025})`
      for (let x = 32; x < width; x += 48) context.fillRect(x, 24, 1, height - 48)
      for (let y = 32; y < height; y += 48) context.fillRect(24, y, width - 48, 1)

      const bars = [0.34, 0.56, 0.42, 0.7, 0.62, 0.86, 0.52]
      bars.forEach((bar, index) => {
        const barWidth = 8
        const x = width - 110 + index * 13
        const barHeight = bar * 70
        context.fillStyle = `rgba(${muted}, ${0.2 + index * 0.035})`
        context.fillRect(x, height - 42 - barHeight, barWidth, barHeight)
      })

      context.beginPath()
      context.moveTo(30, height * 0.73)
      context.lineTo(width - 34, height * 0.28)
      context.strokeStyle = `rgba(${ink}, ${isDark ? 0.72 : 0.62})`
      context.lineWidth = 1.5
      context.stroke()

      pointsRef.current.forEach((point, index) => {
        point.phase += 0.018
        if (isPlaying) {
          point.x += point.vx
          point.y += point.vy + Math.sin(point.phase) * 0.02
        }

        if (point.x < 24 || point.x > width - 24) point.vx *= -1
        if (point.y < 24 || point.y > height - 24) point.vy *= -1

        const pulse = !isPlaying ? 1 : 0.72 + Math.sin(time / 700 + point.phase) * 0.28
        context.beginPath()
        context.arc(point.x, point.y, 2.2 + pulse * 1.2, 0, Math.PI * 2)
        context.fillStyle = `rgba(${ink}, ${0.24 + pulse * 0.28})`
        context.fill()

        const nextPoint = pointsRef.current[index + 1]
        if (nextPoint && index % 3 === 0) {
          context.beginPath()
          context.moveTo(point.x, point.y)
          context.lineTo(nextPoint.x, nextPoint.y)
          context.strokeStyle = `rgba(${muted}, 0.13)`
          context.lineWidth = 1
          context.stroke()
        }
      })

      context.fillStyle = `rgba(${ink}, ${isDark ? 0.9 : 0.76})`
      context.font = '12px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
      context.fillText('model signal', 28, 34)
      context.fillStyle = `rgba(${muted}, 0.8)`
      context.fillText('R² .91', width - 76, 34)

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
      // Keep the existing points across theme and play/pause changes.
      const size = `${rect.width}x${rect.height}`
      if (seededSizeRef.current !== size) {
        seededSizeRef.current = size
        seedPoints(rect.width, rect.height)
      }
      // Resizing clears the canvas, so repaint even while paused.
      restart()
    }

    // Stop the render loop while the canvas is scrolled out of view.
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
    <div className="relative h-72 overflow-hidden rounded-[2rem] border hairline bg-white/70 shadow-[0_24px_80px_-52px_rgba(0,0,0,0.55)] dark:bg-white/[0.06] dark:shadow-none sm:h-[22rem]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      {/* The animation runs indefinitely, so it needs a control to stop it. */}
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
