import { Link } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Building, Calendar, Eye } from 'lucide-react'
import { useUserAccessibleProjects } from '../hooks/api'
import { LoadingSpinner } from './LoadingSpinner'

// Hardcoded user ID for now - will be replaced with Supabase auth later
const CURRENT_USER_ID = '2279c80a-41b6-48ee-80fb-9b0377d79f18'

export function Dashboard() {
  const { data: projects, isLoading, error } = useUserAccessibleProjects(CURRENT_USER_ID)

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          Error loading projects: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Projects List */}
      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <Building className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        project.role === 'admin' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : project.role === 'editor' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {project.role.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(project.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`h-2 w-2 rounded-full ${
                          project.status === 'active' 
                            ? 'bg-green-500' 
                            : project.status === 'disabled'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`} />
                        <span className="capitalize font-medium">{project.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <Link to={`/projects/${project.id}`}>
                      <Button size="lg" className="min-w-[120px]">
                        <Eye className="h-4 w-4 mr-2" />
                        Open Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have access to any projects yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to get access to projects.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}