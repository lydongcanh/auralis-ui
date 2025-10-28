import { Link } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Building, Calendar, Eye, Plus } from 'lucide-react'
import { useUserAccessibleProjects, useCreateProject, useAddUserToProject } from '../hooks/api'
import { LoadingSpinner } from './LoadingSpinner'
import { useState } from 'react'

// Hardcoded user ID for now - will be replaced with Supabase auth later
const CURRENT_USER_ID = 'fdd39363-b1cd-430e-88a8-f1a6199f33ff'

function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const createProject = useCreateProject()
  const addUserToProject = useAddUserToProject()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newProject = await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim() || null
      })
      
      // Link the current user to the newly created project as admin
      if (newProject) {
        await addUserToProject.mutateAsync({
          projectId: newProject.id,
          userId: CURRENT_USER_ID,
          body: { user_role: 'admin' }
        })
      }
      
      setName('')
      setDescription('')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const isPending = createProject.isPending || addUserToProject.isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
    <div className="h-full w-full p-6 space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 leading-none">Projects</h1>
        <CreateProjectDialog />
      </div>

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
            <p className="text-muted-foreground mb-6">
              You don't have access to any projects yet. Create your first project to get started.
            </p>
            <CreateProjectDialog />
          </CardContent>
        </Card>
      )}
    </div>
  )
}