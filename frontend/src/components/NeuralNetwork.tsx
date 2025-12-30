import { useEffect, useRef, useCallback } from 'react'
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

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const initializeNetwork = useCallback((width: number, height: number) => {
    const nodeCount = Math.min(50, Math.floor((width * height) / 25000))
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    nodesRef.current = nodes

    // Create connections between nearby nodes
    const connections: Connection[] = []
    const maxDistance = Math.min(width, height) * 0.2

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && Math.random() > 0.6) {
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

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const nodes = nodesRef.current
    const connections = connectionsRef.current

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
      const baseOpacity = conn.opacity * 0.5
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      ctx.strokeStyle = `rgba(${lineColor}, ${baseOpacity})`
      ctx.lineWidth = 1.5
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
  }, [isDarkMode])

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

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, initializeNetwork])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  )
}
