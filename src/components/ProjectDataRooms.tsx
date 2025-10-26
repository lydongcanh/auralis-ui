import { useProjectDataRooms } from '../hooks/api'
import { Folder, Calendar } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'
import type { DataRoom } from '../types/api'

interface ProjectDataRoomsProps {
  readonly projectId: string
}

function DataRoomRow({ dataRoom }: { readonly dataRoom: DataRoom }) {
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'disabled':
        return 'bg-yellow-500'
      default:
        return 'bg-red-500'
    }
  }

  return (
    <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Left side - Icon and Name */}
      <div className="flex items-center space-x-4">
        <Folder className="h-7 w-7 text-blue-600 flex-shrink-0" />
        <div>
          <h4 className="text-lg font-semibold text-gray-900 truncate">{dataRoom.name}</h4>
          <div className="flex items-center space-x-3 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              dataRoom.source === 'ansarada' 
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {dataRoom.source.toUpperCase()}
            </span>
            <div className="flex items-center space-x-1">
              <div className={`h-2 w-2 rounded-full ${getStatusColorClass(dataRoom.status)}`} />
              <span className="text-xs font-medium text-gray-600 capitalize">{dataRoom.status}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Date */}
      <div className="flex items-center space-x-2 text-gray-500">
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">{new Date(dataRoom.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })}</span>
      </div>
    </div>
  )
}

export function ProjectDataRooms({ projectId }: ProjectDataRoomsProps) {
  const { data: dataRooms, isLoading, error } = useProjectDataRooms(projectId)

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
          Error loading data rooms: {error.message}
        </div>
      </div>
    )
  }

  if (!dataRooms || dataRooms.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Rooms</h3>
          <p className="text-gray-500">This project doesn't have any data rooms linked yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Data Rooms ({dataRooms.length})</h3>
        </div>
        <div className="space-y-3">
          {dataRooms.map((dataRoom) => (
            <DataRoomRow key={dataRoom.id} dataRoom={dataRoom} />
          ))}
        </div>
      </div>
    </div>
  )
}