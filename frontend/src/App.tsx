import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import LoadingFallback from './components/LoadingFallback'

// Eagerly load the home page for fast initial render
import Home from './pages/Home'

// Lazy load other pages to reduce initial bundle size
const About = lazy(() => import('./pages/About'))
const Skills = lazy(() => import('./pages/Skills'))
const Projects = lazy(() => import('./pages/Projects'))

// Lazy load heavy demo pages with interactive charts
const LinearRegressionDemo = lazy(() => import('./pages/LinearRegressionDemo'))
const KMeansDemo = lazy(() => import('./pages/KMeansDemo'))

// Lazy load content pages
const WeeklyMedia = lazy(() => import('./pages/WeeklyMedia'))

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="skills" element={<Skills />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/linear-regression" element={<LinearRegressionDemo />} />
          <Route path="projects/kmeans" element={<KMeansDemo />} />
          <Route path="weekly-media" element={<WeeklyMedia />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
