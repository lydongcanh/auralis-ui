import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useUser } from '../hooks/api'
import { User, Calendar, Shield } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'

interface ProjectUsersProps {
  readonly userIds: string[]
}

function UserCard({ userId }: { readonly userId: string }) {
  const { data: user, isLoading, error } = useUser(userId)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !user) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="text-red-500 text-sm">
            Failed to load user: {userId}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <User className="h-5 w-5 text-green-600" />
          <span className="font-mono text-sm">{user.auth_provider_user_id}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${
              user.status === 'active' 
                ? 'bg-green-500' 
                : user.status === 'disabled'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`} />
            <span className="capitalize">{user.status}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>{user.accessible_user_project_ids.length} accessible projects</span>
          </div>
          <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
            ID: {user.id}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectUsers({ userIds }: ProjectUsersProps) {
  if (userIds.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Users</h3>
        <p className="text-gray-500">This project doesn't have any users assigned yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Users ({userIds.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userIds.map((userId) => (
          <UserCard key={userId} userId={userId} />
        ))}
      </div>
    </div>
  )
}