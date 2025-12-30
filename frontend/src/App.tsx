import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import LinearRegressionDemo from './pages/LinearRegressionDemo'
import KMeansDemo from './pages/KMeansDemo'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/linear-regression" element={<LinearRegressionDemo />} />
        <Route path="projects/kmeans" element={<KMeansDemo />} />
      </Route>
    </Routes>
  )
}

export default App
