import { useParams, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowLeft, Settings, Play, Pause, Upload } from 'lucide-react'

export function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>()

  // Mock project data based on ID
  const getProjectData = (id: string) => {
    const projects = {
      '1': { name: 'Auralis Core', description: 'Core audio processing engine' },
      '2': { name: 'Voice Recognition', description: 'Advanced voice recognition module' },
      '3': { name: 'UI Components', description: 'Reusable React components' },
    }
    return projects[id as keyof typeof projects] || { name: 'Unknown Project', description: 'Project not found' }
  }

  const project = getProjectData(projectId!)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Project ID indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-blue-800">
          <strong>Project ID:</strong> {projectId}
        </p>
      </div>

      {/* Main project content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Project Workspace</h2>
            
            {/* Audio controls */}
            <div className="flex items-center gap-4 mb-6">
              <Button>
                <Play className="w-4 h-4 mr-2" />
                Process Audio
              </Button>
              <Button variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>

            {/* Placeholder content */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500 mb-4">Project workspace area</p>
              <p className="text-sm text-gray-400">
                This is where you can work on your project. Add your project-specific components and functionality here.
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Project Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <span className="ml-2 text-green-600">Active</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <span className="ml-2">2 days ago</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Last Modified:</span>
                <span className="ml-2">1 hour ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Export Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Share Project
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Duplicate Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}