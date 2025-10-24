import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useProject } from '../hooks/api'
import { Loader2, Search } from 'lucide-react'

export function ProjectList() {
  const [projectId, setProjectId] = useState('')
  const [searchId, setSearchId] = useState('')
  
  const { data: project, isLoading, error } = useProject(searchId)

  const handleSearch = () => {
    if (projectId.trim()) {
      setSearchId(projectId.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter project ID to search"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          Error: {error.message}
        </div>
      )}

      {project && (
        <div className="border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground">{project.description || 'No description'}</p>
          <div className="text-xs text-muted-foreground">
            <p>ID: {project.id}</p>
            <p>Status: <span className="capitalize">{project.status}</span></p>
            <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
            <p>Data Rooms: {project.data_room_ids.length}</p>
            <p>Users: {project.accessible_user_project_ids.length}</p>
          </div>
        </div>
      )}

      {searchId && !isLoading && !project && !error && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No project found with ID: {searchId}
        </div>
      )}

      {!searchId && (
        <div className="text-sm text-muted-foreground text-center py-4">
          Enter a project ID to search for a specific project
        </div>
      )}
    </div>
  )
}