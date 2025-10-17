import { Link } from 'react-router-dom'
import { Button } from './ui/button'

// Mock data for demonstration
const projects = [
  { id: '1', name: 'Auralis Core', description: 'Core audio processing engine' },
  { id: '2', name: 'Voice Recognition', description: 'Advanced voice recognition module' },
  { id: '3', name: 'UI Components', description: 'Reusable React components' },
]

export function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {project.name}
            </h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <Link to={`/projects/${project.id}`}>
              <Button className="w-full">
                Open Project
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button variant="outline">
          + Create New Project
        </Button>
      </div>
    </div>
  )
}