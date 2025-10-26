import { useProjectUsers } from '../hooks/api'
import { User, Shield } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'
import type { ProjectUserOut } from '../types/api'

interface ProjectUsersProps {
  readonly projectId: string
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
      <div className="flex items-center space-x-4">
        <User className="h-7 w-7 text-green-600 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 truncate font-mono">{projectUser.user_auth_provider_user_id}</h4>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColorClass(projectUser.user_role)}`}>
              {projectUser.user_role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right side - Role Info */}
      <div className="flex items-center space-x-2 text-gray-500">
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

  if (!projectUsers || projectUsers.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users</h3>
          <p className="text-gray-500">This project doesn't have any users assigned yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Users ({projectUsers.length})</h3>
        </div>
        <div className="space-y-3">
          {projectUsers.map((projectUser) => (
            <UserRow key={projectUser.user_id} projectUser={projectUser} />
          ))}
        </div>
      </div>
    </div>
  )
}