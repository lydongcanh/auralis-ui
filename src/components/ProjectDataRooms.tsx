import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useDataRoom } from '../hooks/api'
import { Folder, Calendar } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'

interface ProjectDataRoomsProps {
  readonly dataRoomIds: string[]
}

function DataRoomCard({ dataRoomId }: { readonly dataRoomId: string }) {
  const { data: dataRoom, isLoading, error } = useDataRoom(dataRoomId)

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

  if (error || !dataRoom) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="text-red-500 text-sm">
            Failed to load data room: {dataRoomId}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Folder className="h-5 w-5 text-blue-600" />
          <span>{dataRoom.name}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            dataRoom.source === 'ansarada' 
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            {dataRoom.source.toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Created {new Date(dataRoom.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${
              dataRoom.status === 'active' 
                ? 'bg-green-500' 
                : dataRoom.status === 'disabled'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`} />
            <span className="capitalize">{dataRoom.status}</span>
          </div>
          <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
            Root Folder: {dataRoom.root_folder_id}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectDataRooms({ dataRoomIds }: ProjectDataRoomsProps) {
  if (dataRoomIds.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Rooms</h3>
        <p className="text-gray-500">This project doesn't have any data rooms linked yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Data Rooms ({dataRoomIds.length})</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataRoomIds.map((dataRoomId) => (
          <DataRoomCard key={dataRoomId} dataRoomId={dataRoomId} />
        ))}
      </div>
    </div>
  )
}