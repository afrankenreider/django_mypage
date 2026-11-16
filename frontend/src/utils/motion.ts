import type { CSSProperties } from 'react'

/**
 * Stagger position for the `.enter` animation in index.css. Returns the
 * inline custom property that delays an element's entrance.
 */
export const enterIndex = (index: number): CSSProperties =>
  ({ '--enter-index': index }) as CSSProperties
