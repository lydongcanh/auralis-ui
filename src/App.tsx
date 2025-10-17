import './App.css'
import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { RootLayout } from './components/RootLayout'
import { LoadingSpinner } from './components/LoadingSpinner'

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })))
const ProjectView = lazy(() => import('./components/ProjectView').then(module => ({ default: module.ProjectView })))
const NotFound = lazy(() => import('./components/NotFound').then(module => ({ default: module.NotFound })))

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
