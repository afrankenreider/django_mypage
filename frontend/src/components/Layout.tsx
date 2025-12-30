import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import NeuralNetwork from './NeuralNetwork'
import ErrorBoundary from './ErrorBoundary'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 relative">
      {/* Neural Network Animation - Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ErrorBoundary fallback={null}>
          <NeuralNetwork />
        </ErrorBoundary>
      </div>

      <Navbar />
      <main className="flex-grow relative z-10">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
