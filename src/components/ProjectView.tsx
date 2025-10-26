import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { FolderOpen, Users } from 'lucide-react'
import { useProject } from '../hooks/api'
import { LoadingSpinner } from './LoadingSpinner'
import { ProjectDataRooms } from './ProjectDataRooms'
import { ProjectUsers } from './ProjectUsers'

export function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>()
  
  const { data: project, isLoading, error } = useProject(projectId!)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          Error loading project: {error.message}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-muted-foreground text-center py-8">
          Project not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{project.name}</h1>
      </div>

      {/* Tabs for Data Rooms and Users */}
      <Tabs defaultValue="datarooms" className="w-full" orientation="vertical">
        <div className="flex space-x-8">
          <div className="w-64">
            <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-2">
              <TabsTrigger 
                value="datarooms" 
                className="flex items-center justify-start space-x-3 w-full h-12 px-4 rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-gray-100"
              >
                <FolderOpen className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Data Rooms</span>
                  <span className="text-xs text-muted-foreground">{project.data_room_ids.length} items</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center justify-start space-x-3 w-full h-12 px-4 rounded-lg data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 hover:bg-gray-100"
              >
                <Users className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">Users</span>
                  <span className="text-xs text-muted-foreground">{project.accessible_user_project_ids.length} items</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1">
            <TabsContent value="datarooms" className="mt-0">
              <ProjectDataRooms dataRoomIds={project.data_room_ids} />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0">
              <ProjectUsers userIds={project.accessible_user_project_ids} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}