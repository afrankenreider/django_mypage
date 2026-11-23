import type { DemoKind } from '../components/DemoGlyph'

export interface Demo {
  title: string
  description: string
  category: string
  link: string
  kind: DemoKind
  capabilities: string[]
}

/** The interactive demos, shared by the home page and the projects page. */
export const demos: Demo[] = [
  {
    title: 'Linear Regression',
    description:
      'Fit a line to a dataset, then check the residuals and diagnostics to see how good the fit really is.',
    category: 'Statistical modeling',
    link: '/projects/linear-regression',
    kind: 'regression',
    capabilities: ['Interactive fit', 'Residual analysis', 'Model diagnostics'],
  },
  {
    title: 'K-Means Clustering',
    description:
      'Watch k-means place its centroids, assign points, and repeat until the clusters stop moving.',
    category: 'Unsupervised learning',
    link: '/projects/kmeans',
    kind: 'kmeans',
    capabilities: ['Live clustering', 'Iteration history', 'Quality scoring'],
  },
  {
    title: 'Neural Networks',
    description:
      'Change the layers and activation functions of a small network and see how a signal moves through it.',
    category: 'Deep learning',
    link: '/projects/neural-networks',
    kind: 'neural',
    capabilities: ['Layer controls', 'Activation flow', 'Training concepts'],
  },
  {
    title: 'Finance Dashboard',
    description: 'Stock watchlists, technical indicators, and some price forecasting experiments.',
    category: 'Financial analytics',
    link: '/projects/finance-dashboard',
    kind: 'finance',
    capabilities: ['Market overview', 'Forecasting lab', 'Custom watchlist'],
  },
]
