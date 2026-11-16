import { MotionConfig } from 'framer-motion'
import { Outlet } from 'react-router-dom'

/**
 * Wraps the interactive demo routes. Framer Motion drives their animation
 * from JavaScript, which CSS media queries cannot reach, so this makes it
 * honor the reduced-motion preference. Loaded with the demos, which keeps
 * Framer Motion out of the initial bundle.
 */
export default function DemoLayout() {
  return (
    <MotionConfig reducedMotion="user">
      <Outlet />
    </MotionConfig>
  )
}
