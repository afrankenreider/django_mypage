import { useEffect, useRef, useCallback, useState } from 'react'
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

// Throttle animation to ~30fps for better performance
const FRAME_INTERVAL = 1000 / 30

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

  // Keep the ref updated with the current theme
  useEffect(() => {
    isDarkModeRef.current = theme === 'dark'
  }, [theme])

  const initializeNetwork = useCallback((width: number, height: number) => {
    // Increased node count for better visibility while maintaining performance
    const nodeCount = Math.min(35, Math.floor((width * height) / 35000))
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.5 + 2,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    nodesRef.current = nodes

    // Create connections between nearby nodes
    const connections: Connection[] = []
    const maxDistance = Math.min(width, height) * 0.25

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && Math.random() > 0.5) {
          connections.push({
            from: i,
            to: j,
            opacity: 1 - distance / maxDistance,
            pulsePosition: Math.random(),
            pulseSpeed: 0.002 + Math.random() * 0.003,
            active: Math.random() > 0.5,
          })
        }
      }
    }

    connectionsRef.current = connections
  }, [])

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Throttle to target frame rate
    const elapsed = timestamp - lastFrameTimeRef.current
    if (elapsed < FRAME_INTERVAL) {
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
      ctx.lineWidth = 2
      ctx.stroke()

      // Animate pulse along active connections
      if (conn.active) {
        conn.pulsePosition += conn.pulseSpeed
        if (conn.pulsePosition > 1) {
          conn.pulsePosition = 0
          conn.active = Math.random() > 0.3
        }

        // Draw pulse - larger and more visible
        const pulseX = fromNode.x + (toNode.x - fromNode.x) * conn.pulsePosition
        const pulseY = fromNode.y + (toNode.y - fromNode.y) * conn.pulsePosition

        const gradient = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 12)
        gradient.addColorStop(0, `rgba(${pulseColor}, ${0.8 * conn.opacity})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.beginPath()
        ctx.arc(pulseX, pulseY, 12, 0, Math.PI * 2)
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
      node.pulsePhase += 0.02

      // Bounce off edges
      if (node.x < 0 || node.x > width) node.vx *= -1
      if (node.y < 0 || node.y > height) node.vy *= -1

      // Keep in bounds
      node.x = Math.max(0, Math.min(width, node.x))
      node.y = Math.max(0, Math.min(height, node.y))

      // Pulsing effect
      const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7
      const currentRadius = node.radius * pulse

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
  }, []) // No dependencies - uses refs for all mutable values

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

      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext('2d')
      if (ctx) ctx.scale(dpr, dpr)

      initializeNetwork(rect.width, rect.height)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

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
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [initializeNetwork])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  )
}
