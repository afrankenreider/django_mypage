import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulsePhase: number
}

interface Connection {
  from: number
  to: number
  opacity: number
  pulsePosition: number
  pulseSpeed: number
  active: boolean
}

// Detect if device is mobile/low-power
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  // Check for touch capability and screen size
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth < 768
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return hasTouch || isSmallScreen || prefersReducedMotion
}

// Throttle animation - lower FPS on mobile for better performance
const getFrameInterval = (isMobile: boolean): number => {
  return isMobile ? 1000 / 15 : 1000 / 30 // 15fps on mobile, 30fps on desktop
}

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const lastFrameTimeRef = useRef<number>(0)
  const isVisibleRef = useRef(true)
  const [, setIsVisible] = useState(true) // Keep state for re-render on visibility change
  const { theme } = useTheme()
  const isDarkModeRef = useRef(theme === 'dark')

  // Memoize mobile detection to avoid recalculating
  const isMobile = useMemo(() => isMobileDevice(), [])
  const frameInterval = useMemo(() => getFrameInterval(isMobile), [isMobile])

  // Keep the ref updated with the current theme
  useEffect(() => {
    isDarkModeRef.current = theme === 'dark'
  }, [theme])

  const initializeNetwork = useCallback((width: number, height: number, mobile: boolean) => {
    // Significantly reduce node count on mobile for better performance
    const baseNodeCount = mobile
      ? Math.min(12, Math.floor((width * height) / 80000))  // Much fewer nodes on mobile
      : Math.min(35, Math.floor((width * height) / 35000))

    const nodeCount = Math.max(6, baseNodeCount) // Minimum 6 nodes
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (mobile ? 0.3 : 0.5), // Slower movement on mobile
        vy: (Math.random() - 0.5) * (mobile ? 0.3 : 0.5),
        radius: Math.random() * 2.5 + 2,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    nodesRef.current = nodes

    // Create connections between nearby nodes - fewer on mobile
    const connections: Connection[] = []
    const maxDistance = Math.min(width, height) * (mobile ? 0.3 : 0.25)
    const connectionProbability = mobile ? 0.7 : 0.5 // Higher threshold = fewer connections on mobile

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && Math.random() > connectionProbability) {
          connections.push({
            from: i,
            to: j,
            opacity: 1 - distance / maxDistance,
            pulsePosition: Math.random(),
            pulseSpeed: 0.002 + Math.random() * 0.003,
            active: Math.random() > (mobile ? 0.7 : 0.5), // Fewer active connections on mobile
          })
        }
      }
    }

    connectionsRef.current = connections
  }, [])

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Throttle to target frame rate (lower on mobile)
    const elapsed = timestamp - lastFrameTimeRef.current
    if (elapsed < frameInterval) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }
    lastFrameTimeRef.current = timestamp

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const nodes = nodesRef.current
    const connections = connectionsRef.current
    const isDarkMode = isDarkModeRef.current

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Update and draw connections
    const lineColor = isDarkMode ? '148, 163, 184' : '100, 116, 139'
    const pulseColor = isDarkMode ? '248, 250, 252' : '15, 23, 42'

    connections.forEach((conn) => {
      const fromNode = nodes[conn.from]
      const toNode = nodes[conn.to]

      if (!fromNode || !toNode) return

      // Draw base connection line - increased opacity and thickness
      const baseOpacity = conn.opacity * 0.7
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.strokeStyle = `rgba(${lineColor}, ${baseOpacity})`
      ctx.lineWidth = isMobile ? 1.5 : 2 // Thinner lines on mobile
      ctx.stroke()

      // Animate pulse along active connections (skip some pulses on mobile)
      if (conn.active && (!isMobile || Math.random() > 0.3)) {
        conn.pulsePosition += conn.pulseSpeed
        if (conn.pulsePosition > 1) {
          conn.pulsePosition = 0
          conn.active = Math.random() > (isMobile ? 0.5 : 0.3)
        }

        // Draw pulse - smaller on mobile
        const pulseX = fromNode.x + (toNode.x - fromNode.x) * conn.pulsePosition
        const pulseY = fromNode.y + (toNode.y - fromNode.y) * conn.pulsePosition
        const pulseSize = isMobile ? 8 : 12

        const gradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, pulseSize)
        gradient.addColorStop(0, `rgba(${pulseColor}, ${0.8 * conn.opacity})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.beginPath()
        ctx.arc(pulseX, pulseY, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      } else if (Math.random() > 0.998) {
        conn.active = true
      }
    })

    // Update and draw nodes
    const nodeColor = isDarkMode ? '148, 163, 184' : '71, 85, 105'
    const nodeGlow = isDarkMode ? '248, 250, 252' : '15, 23, 42'

    nodes.forEach((node) => {
      // Update position
      node.x += node.vx
      node.y += node.vy
      node.pulsePhase += isMobile ? 0.015 : 0.02 // Slower pulse on mobile

      // Bounce off edges
      if (node.x < 0 || node.x > width) node.vx *= -1
      if (node.y < 0 || node.y > height) node.vy *= -1

      // Keep in bounds
      node.x = Math.max(0, Math.min(width, node.x))
      node.y = Math.max(0, Math.min(height, node.y))

      // Pulsing effect
      const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7
      const currentRadius = node.radius * pulse

      // Skip glow effect on mobile for performance
      if (!isMobile) {
        // Draw node glow
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, currentRadius * 4
        )
        glowGradient.addColorStop(0, `rgba(${nodeGlow}, ${0.15 * pulse})`)
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.beginPath()
        ctx.arc(node.x, node.y, currentRadius * 4, 0, Math.PI * 2)
        ctx.fillStyle = glowGradient
        ctx.fill()
      }

      // Draw node
      ctx.beginPath()
      ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${nodeColor}, ${0.6 + pulse * 0.4})`
      ctx.fill()
    })

    // Update connections based on current node positions
    const maxDistance = Math.min(width, height) * 0.2
    connections.forEach((conn) => {
      const fromNode = nodes[conn.from]
      const toNode = nodes[conn.to]
      if (!fromNode || !toNode) return

      const dx = fromNode.x - toNode.x
      const dy = fromNode.y - toNode.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      conn.opacity = Math.max(0, 1 - distance / maxDistance)
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [frameInterval, isMobile]) // Add dependencies

  // Handle visibility changes to start/stop animation
  useEffect(() => {
    if (isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const container = canvas.parentElement
      if (!container) return

      // Use lower DPR on mobile to reduce rendering load
      const maxDpr = isMobile ? 1.5 : 2
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const rect = container.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)

      initializeNetwork(rect.width, rect.height, isMobile)
    }

    handleResize()

    // Debounce resize handler on mobile
    let resizeTimeout: number | null = null
    const debouncedResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
      resizeTimeout = window.setTimeout(handleResize, isMobile ? 250 : 100)
    }

    window.addEventListener('resize', debouncedResize)

    // Set up IntersectionObserver to pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting
          setIsVisible(entry.isIntersecting)

          if (entry.isIntersecting && !animationRef.current) {
            animationRef.current = requestAnimationFrame(animate)
          } else if (!entry.isIntersecting && animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = null
          }
        })
      },
      { threshold: 0 }
    )

    if (canvas) {
      observer.observe(canvas)
    }

    return () => {
      window.removeEventListener('resize', debouncedResize)
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
      observer.disconnect()
    }
  }, [initializeNetwork, isMobile, animate])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  )
}
