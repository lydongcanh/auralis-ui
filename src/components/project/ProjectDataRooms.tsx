import { useProjectDataRooms, useCreateDataRoom, useLinkDataRoom } from '../../hooks/api'
import { Folder, Calendar, Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { LoadingSpinner } from '../common'
import { DocumentTree } from '../data-room'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import type { DataRoom } from '../../types/api'
import { useState } from 'react'

interface ProjectDataRoomsProps {
  readonly projectId: string
}

function CreateDataRoomDialog({ projectId }: { readonly projectId: string }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [source, setSource] = useState<'original' | 'ansarada'>('original')
  const createDataRoom = useCreateDataRoom()
  const linkDataRoom = useLinkDataRoom()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dataRoom = await createDataRoom.mutateAsync({
        name: name.trim(),
        source
      })
      if (dataRoom) {
        await linkDataRoom.mutateAsync({
          projectId,
          dataRoomId: dataRoom.id
        })
      }
      setName('')
      setSource('original')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create data room:', error)
    }
  }

  const isPending = createDataRoom.isPending || linkDataRoom.isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Data Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Data Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Data Room Name</Label>
            <Input
              id="name"
              placeholder="Enter data room name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={source} onValueChange={(value: 'original' | 'ansarada') => setSource(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original</SelectItem>
                <SelectItem value="ansarada">Ansarada</SelectItem>
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
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? 'Creating...' : 'Create Data Room'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DataRoomRow({ dataRoom }: { readonly dataRoom: DataRoom }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
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
    <div className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
      {/* Main row */}
      <div className="flex items-center justify-between p-6">
        {/* Left side - Icon and Name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Folder className="h-7 w-7 text-blue-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h4 className="text-lg font-semibold text-gray-900 truncate">{dataRoom.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                dataRoom.source === 'ansarada' 
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {dataRoom.source.toUpperCase()}
              </span>
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${getStatusColorClass(dataRoom.status)}`} />
                <span className="text-xs font-medium text-gray-600 capitalize">{dataRoom.status}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Date and Actions */}
        <div className="flex items-center gap-4 text-gray-500 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">{new Date(dataRoom.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronDown className="h-4 w-4" />
                Hide Documents
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4" />
                View Documents
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Expandable Document Tree */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <DocumentTree dataRoomId={dataRoom.id} />
        </div>
      )}
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

  return (
    <div className="h-full w-full p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Data Rooms ({dataRooms?.length || 0})</h3>
          <CreateDataRoomDialog projectId={projectId} />
        </div>
        
        {!dataRooms || dataRooms.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Rooms</h3>
              <p className="text-gray-500">This project doesn't have any data rooms linked yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {dataRooms.map((dataRoom) => (
              <DataRoomRow key={dataRoom.id} dataRoom={dataRoom} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}