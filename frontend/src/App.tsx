import { Routes, Route } from 'react-router-dom'
import { lazy } from 'react'
import Layout from './components/Layout'

// Eagerly load the home page for fast initial render
import Home from './pages/Home'

// Lazy load other pages to reduce initial bundle size
const About = lazy(() => import('./pages/About'))
const Skills = lazy(() => import('./pages/Skills'))
const Projects = lazy(() => import('./pages/Projects'))
const WeeklyMedia = lazy(() => import('./pages/WeeklyMedia'))

// Lazy load heavy demo pages with interactive charts
const DemoLayout = lazy(() => import('./components/DemoLayout'))
const LinearRegressionDemo = lazy(() => import('./pages/LinearRegressionDemo'))
const KMeansDemo = lazy(() => import('./pages/KMeansDemo'))
const NeuralNetworkDemo = lazy(() => import('./pages/NeuralNetworkDemo'))
const FinanceDashboard = lazy(() => import('./pages/FinanceDashboard'))

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="weekly-media" element={<WeeklyMedia />} />
        <Route element={<DemoLayout />}>
          <Route path="projects/linear-regression" element={<LinearRegressionDemo />} />
          <Route path="projects/kmeans" element={<KMeansDemo />} />
          <Route path="projects/neural-networks" element={<NeuralNetworkDemo />} />
          <Route path="projects/finance-dashboard" element={<FinanceDashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
