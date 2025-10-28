import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useUser, useUserAccessibleProjects } from '../../hooks/api'
import { Loader2, Search, Users } from 'lucide-react'

export function UserList() {
  const [userId, setUserId] = useState('')
  const [searchId, setSearchId] = useState('')
  const [showProjects, setShowProjects] = useState(false)
  
  const { data: user, isLoading, error } = useUser(searchId)
  const { 
    data: userProjects, 
    isLoading: isLoadingProjects, 
    error: projectsError 
  } = useUserAccessibleProjects(showProjects ? searchId : '')

  const handleSearch = () => {
    if (userId.trim()) {
      setSearchId(userId.trim())
      setShowProjects(false)
    }
  }

  const handleShowProjects = () => {
    if (searchId) {
      setShowProjects(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter user ID to search"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
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

      {user && (
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold">User Details</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>ID: {user.id}</p>
            <p>Auth Provider ID: {user.auth_provider_user_id}</p>
            <p>Status: <span className="capitalize">{user.status}</span></p>
            <p>Created: {new Date(user.created_at).toLocaleDateString()}</p>
            <p>Accessible Projects: {user.accessible_user_project_ids.length}</p>
          </div>
          
          {user.accessible_user_project_ids.length > 0 && (
            <Button onClick={handleShowProjects} size="sm" variant="outline" className="mt-2">
              <Users className="h-4 w-4 mr-1" />
              Show Projects
            </Button>
          )}
        </div>
      )}

      {isLoadingProjects && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading user projects...
        </div>
      )}

      {projectsError && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          Projects Error: {projectsError.message}
        </div>
      )}

      {showProjects && userProjects && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">User's Accessible Projects</h4>
          {userProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="font-semibold text-sm">{project.name}</h5>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {project.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{project.description || 'No description'}</p>
              <div className="text-xs text-muted-foreground">
                <p>Project ID: {project.id}</p>
                <p>Status: <span className="capitalize">{project.status}</span></p>
                <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchId && !isLoading && !user && !error && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No user found with ID: {searchId}
        </div>
      )}

      {!searchId && (
        <div className="text-sm text-muted-foreground text-center py-4">
          Enter a user ID to search for a specific user
        </div>
      )}
    </div>
  )
}