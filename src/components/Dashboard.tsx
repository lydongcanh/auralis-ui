import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Users, FolderOpen, Building } from 'lucide-react'
import { ProjectForm } from './ProjectForm'
import { DataRoomForm } from './DataRoomForm'
import { UserForm } from './UserForm'
import { ProjectList } from './ProjectList'
import { DataRoomList } from './DataRoomList'
import { UserList } from './UserList'

export function Dashboard() {
  const [activeForm, setActiveForm] = useState<'project' | 'dataroom' | 'user' | null>(null)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Auralis Dashboard</h1>
        <p className="text-muted-foreground">Manage your projects, data rooms, and users</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('project')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Project</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+</div>
            <p className="text-xs text-muted-foreground">Add a new project</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('dataroom')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create Data Room</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+</div>
            <p className="text-xs text-muted-foreground">Add a new data room</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('user')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Create User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+</div>
            <p className="text-xs text-muted-foreground">Add a new user</p>
          </CardContent>
        </Card>
      </div>

      {/* Forms */}
      {activeForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {activeForm === 'project' && 'Create New Project'}
                {activeForm === 'dataroom' && 'Create New Data Room'}
                {activeForm === 'user' && 'Create New User'}
              </CardTitle>
              <Button variant="outline" onClick={() => setActiveForm(null)}>Cancel</Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeForm === 'project' && <ProjectForm onSuccess={() => setActiveForm(null)} />}
            {activeForm === 'dataroom' && <DataRoomForm onSuccess={() => setActiveForm(null)} />}
            {activeForm === 'user' && <UserForm onSuccess={() => setActiveForm(null)} />}
          </CardContent>
        </Card>
      )}

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Rooms</CardTitle>
            <CardDescription>Available data rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <DataRoomList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>System users</CardDescription>
          </CardHeader>
          <CardContent>
            <UserList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}