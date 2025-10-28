import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'
import { FolderOpen, Users, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useProject, useProjectDataRooms, useProjectUsers } from '../../hooks/api'
import { LoadingSpinner } from '../common'
import { ProjectDataRooms } from './ProjectDataRooms'
import { ProjectUsers } from './ProjectUsers'
import { useState } from 'react'

export function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const { data: project, isLoading, error } = useProject(projectId!)
  const { data: dataRooms } = useProjectDataRooms(projectId!)
  const { data: projectUsers } = useProjectUsers(projectId!)

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full w-full p-6">
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          Error loading project: {error.message}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-muted-foreground text-center">
          Project not found
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tabs for Data Rooms and Users */}
        <Tabs defaultValue="datarooms" className="flex-1 flex" orientation="vertical">
          <div className="flex h-full w-full">
            {/* Sidebar */}
            {sidebarOpen && (
              <div className="w-64 border-r bg-gray-50 p-4 flex-shrink-0">
                <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-2">
                  <TabsTrigger 
                    value="datarooms" 
                    className="flex items-center justify-start space-x-3 w-full h-12 px-4 rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-gray-100"
                  >
                    <FolderOpen className="h-5 w-5" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Data Rooms</span>
                      <span className="text-xs text-muted-foreground">{dataRooms?.length || 0} items</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center justify-start space-x-3 w-full h-12 px-4 rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-gray-100"
                  >
                    <Users className="h-5 w-5" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Users</span>
                      <span className="text-xs text-muted-foreground">{projectUsers?.length || 0} items</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
            )}
            
            {/* Main Content */}
            <div className="flex-1 overflow-auto min-w-0">
              <TabsContent value="datarooms" className="m-0 h-full">
                <ProjectDataRooms projectId={projectId!} />
              </TabsContent>
              
              <TabsContent value="users" className="m-0 h-full">
                <ProjectUsers projectId={projectId!} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}