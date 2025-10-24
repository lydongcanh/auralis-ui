import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ArrowLeft, Settings, Users, FolderOpen, Loader2, Plus, Minus } from 'lucide-react'
import { 
  useProject, 
  useLinkDataRoom, 
  useUnlinkDataRoom, 
  useAddUserToProject, 
  useRemoveUserFromProject 
} from '../hooks/api'
import type { UserRole } from '../types/api'

export function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>()
  const [dataRoomId, setDataRoomId] = useState('')
  const [userId, setUserId] = useState('')
  const [userRole, setUserRole] = useState<UserRole>('viewer')
  
  const { data: project, isLoading, error } = useProject(projectId!)
  const linkDataRoomMutation = useLinkDataRoom()
  const unlinkDataRoomMutation = useUnlinkDataRoom()
  const addUserMutation = useAddUserToProject()
  const removeUserMutation = useRemoveUserFromProject()

  const handleLinkDataRoom = async () => {
    if (dataRoomId.trim() && projectId) {
      try {
        await linkDataRoomMutation.mutateAsync({ projectId, dataRoomId: dataRoomId.trim() })
        setDataRoomId('')
      } catch (error) {
        console.error('Error linking data room:', error)
      }
    }
  }

  const handleUnlinkDataRoom = async (roomId: string) => {
    if (projectId) {
      try {
        await unlinkDataRoomMutation.mutateAsync({ projectId, dataRoomId: roomId })
      } catch (error) {
        console.error('Error unlinking data room:', error)
      }
    }
  }

  const handleAddUser = async () => {
    if (userId.trim() && projectId) {
      try {
        await addUserMutation.mutateAsync({ 
          projectId, 
          userId: userId.trim(), 
          body: { user_role: userRole }
        })
        setUserId('')
      } catch (error) {
        console.error('Error adding user:', error)
      }
    }
  }

  const handleRemoveUser = async (removeUserId: string) => {
    if (projectId) {
      try {
        await removeUserMutation.mutateAsync({ projectId, userId: removeUserId })
      } catch (error) {
        console.error('Error removing user:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          Loading project...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          Error loading project: {error.message}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-muted-foreground text-center py-8">
          Project not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.description || 'No description'}</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Project Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">ID</Label>
            <p className="font-mono text-sm">{project.id}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
            <p className="capitalize">{project.status}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Created</Label>
            <p>{new Date(project.created_at).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Rooms Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderOpen className="h-5 w-5 mr-2" />
              Data Rooms ({project.data_room_ids.length})
            </CardTitle>
            <CardDescription>
              Manage data rooms linked to this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Data Room */}
            <div className="flex space-x-2">
              <Input
                placeholder="Data room ID"
                value={dataRoomId}
                onChange={(e) => setDataRoomId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkDataRoom()}
              />
              <Button 
                onClick={handleLinkDataRoom}
                disabled={!dataRoomId.trim() || linkDataRoomMutation.isPending}
                size="sm"
              >
                {linkDataRoomMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>

            {linkDataRoomMutation.error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {linkDataRoomMutation.error.message}
              </div>
            )}

            {/* Data Room List */}
            <div className="space-y-2">
              {project.data_room_ids.length === 0 ? (
                <p className="text-muted-foreground text-sm">No data rooms linked</p>
              ) : (
                project.data_room_ids.map((roomId) => (
                  <div key={roomId} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-mono text-sm">{roomId}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlinkDataRoom(roomId)}
                      disabled={unlinkDataRoomMutation.isPending}
                    >
                      {unlinkDataRoomMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>

            {unlinkDataRoomMutation.error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {unlinkDataRoomMutation.error.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Users ({project.accessible_user_project_ids.length})
            </CardTitle>
            <CardDescription>
              Manage users with access to this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add User */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
                />
                <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAddUser}
                  disabled={!userId.trim() || addUserMutation.isPending}
                  size="sm"
                >
                  {addUserMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {addUserMutation.error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {addUserMutation.error.message}
              </div>
            )}

            {/* User List */}
            <div className="space-y-2">
              {project.accessible_user_project_ids.length === 0 ? (
                <p className="text-muted-foreground text-sm">No users assigned</p>
              ) : (
                project.accessible_user_project_ids.map((userProjectId) => (
                  <div key={userProjectId} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-mono text-sm">{userProjectId}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveUser(userProjectId)}
                      disabled={removeUserMutation.isPending}
                    >
                      {removeUserMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>

            {removeUserMutation.error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                {removeUserMutation.error.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}