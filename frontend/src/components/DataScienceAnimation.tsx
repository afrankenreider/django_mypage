import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

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
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isDark = theme === 'dark'
    const ink = isDark ? '245, 245, 247' : '29, 29, 31'
    const muted = isDark ? '161, 161, 166' : '110, 110, 115'
    const grid = isDark ? '255, 255, 255' : '0, 0, 0'

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const width = rect.width
      const height = rect.height
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
        if (!prefersReducedMotion) {
          point.x += point.vx
          point.y += point.vy + Math.sin(point.phase) * 0.02
        }

        if (point.x < 24 || point.x > width - 24) point.vx *= -1
        if (point.y < 24 || point.y > height - 24) point.vy *= -1

        const pulse = prefersReducedMotion ? 1 : 0.72 + Math.sin(time / 700 + point.phase) * 0.28
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

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(draw)
      }
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [theme])

  return (
    <div className="relative h-[22rem] overflow-hidden rounded-[2rem] border hairline bg-white/70 shadow-[0_24px_80px_-52px_rgba(0,0,0,0.55)] dark:bg-white/[0.06]">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent dark:from-black/70" />
    </div>
  )
}
