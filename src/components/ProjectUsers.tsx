import { useProjectUsers, useCreateUser, useAddUserToProject } from '../hooks/api'
import { User, Shield, Plus } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { ProjectUserOut, UserRole } from '../types/api'
import { useState } from 'react'

interface ProjectUsersProps {
  readonly projectId: string
}

function CreateUserDialog({ projectId }: { readonly projectId: string }) {
  const [open, setOpen] = useState(false)
  const [authProviderId, setAuthProviderId] = useState('')
  const [role, setRole] = useState<UserRole>('viewer')
  const createUser = useCreateUser()
  const addUserToProject = useAddUserToProject()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const user = await createUser.mutateAsync({
        auth_provider_user_id: authProviderId.trim()
      })
      if (user) {
        await addUserToProject.mutateAsync({
          projectId,
          userId: user.id,
          body: { user_role: role }
        })
      }
      setAuthProviderId('')
      setRole('viewer')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  }

  const isPending = createUser.isPending || addUserToProject.isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authProviderId">User ID</Label>
            <Input
              id="authProviderId"
              placeholder="Enter user auth provider ID"
              value={authProviderId}
              onChange={(e) => setAuthProviderId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
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
            <Button type="submit" disabled={isPending || !authProviderId.trim()}>
              {isPending ? 'Adding...' : 'Add User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function UserRow({ projectUser }: { readonly projectUser: ProjectUserOut }) {
  const getRoleColorClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'editor':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      default:
        return 'bg-green-100 text-green-800 border border-green-200'
    }
  }

  return (
    <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Left side - Icon and User Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <User className="h-7 w-7 text-green-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h4 className="text-lg font-semibold text-gray-900 truncate font-mono">{projectUser.user_auth_provider_user_id}</h4>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColorClass(projectUser.user_role)}`}>
              {projectUser.user_role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right side - Role Info */}
      <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
        <Shield className="h-4 w-4" />
        <span className="text-sm font-medium">Role: {projectUser.user_role}</span>
      </div>
    </div>
  )
}

export function ProjectUsers({ projectId }: ProjectUsersProps) {
  const { data: projectUsers, isLoading, error } = useProjectUsers(projectId)

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-500 bg-red-50 p-6 rounded-md">
          Error loading users: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Users ({projectUsers?.length || 0})</h3>
          <CreateUserDialog projectId={projectId} />
        </div>
        
        {!projectUsers || projectUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users</h3>
              <p className="text-gray-500">This project doesn't have any users assigned yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {projectUsers.map((projectUser) => (
              <UserRow key={projectUser.user_id} projectUser={projectUser} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}