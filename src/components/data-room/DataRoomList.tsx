import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useDataRoom, useAnsaradaDataRooms } from '../../hooks/api'
import { Loader2, Search, ExternalLink } from 'lucide-react'

export function DataRoomList() {
  const [dataRoomId, setDataRoomId] = useState('')
  const [searchId, setSearchId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [showAnsarada, setShowAnsarada] = useState(false)
  
  const { data: dataRoom, isLoading, error } = useDataRoom(searchId)
  const { 
    data: ansaradaDataRooms, 
    isLoading: isLoadingAnsarada, 
    error: ansaradaError 
  } = useAnsaradaDataRooms(accessToken, 10)

  const handleSearch = () => {
    if (dataRoomId.trim()) {
      setSearchId(dataRoomId.trim())
      setShowAnsarada(false)
    }
  }

  const handleAnsaradaSearch = () => {
    if (accessToken.trim()) {
      setShowAnsarada(true)
      setSearchId('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter data room ID to search"
            value={dataRoomId}
            onChange={(e) => setDataRoomId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Ansarada access token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnsaradaSearch()}
          />
          <Button onClick={handleAnsaradaSearch} size="sm" variant="outline">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
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

      {dataRoom && (
        <div className="border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold">{dataRoom.name}</h3>
          <div className="text-xs text-muted-foreground">
            <p>ID: {dataRoom.id}</p>
            <p>Source: <span className="capitalize">{dataRoom.source}</span></p>
            <p>Status: <span className="capitalize">{dataRoom.status}</span></p>
            <p>Created: {new Date(dataRoom.created_at).toLocaleDateString()}</p>
            <p>Root Folder ID: {dataRoom.root_folder_id}</p>
          </div>
        </div>
      )}

      {isLoadingAnsarada && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading Ansarada data rooms...
        </div>
      )}

      {ansaradaError && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
          Ansarada Error: {ansaradaError.message}
        </div>
      )}

      {showAnsarada && ansaradaDataRooms && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Ansarada Data Rooms</h4>
          {ansaradaDataRooms.map((room) => (
            <div key={room.id} className="border rounded-lg p-3 space-y-1">
              <h5 className="font-semibold text-sm">{room.name}</h5>
              <div className="text-xs text-muted-foreground">
                <p>ID: {room.id}</p>
                <p>Status: <span className="capitalize">{room.status}</span></p>
                <p>Root Folder ID: {room.root_folder_id}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchId && !isLoading && !dataRoom && !error && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No data room found with ID: {searchId}
        </div>
      )}

      {!searchId && !showAnsarada && (
        <div className="text-sm text-muted-foreground text-center py-4">
          Enter a data room ID or Ansarada access token to search
        </div>
      )}
    </div>
  )
}