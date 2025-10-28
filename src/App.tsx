import './App.css'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary, LoadingSpinner, NotFound } from './components/common'
import { RootLayout } from './components/layout'

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/project').then(module => ({ default: module.Dashboard })))
const ProjectView = lazy(() => import('./components/project').then(module => ({ default: module.ProjectView })))

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects/:projectId" element={<ProjectView />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
