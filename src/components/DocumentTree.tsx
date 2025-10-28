import { useState } from 'react'
import { ChevronDown, ChevronRight, File, Folder, FolderPlus, FilePlus } from 'lucide-react'
import { Button } from './ui/button'
import { LoadingSpinner } from './LoadingSpinner'
import { useDocumentTree, useCreateFolder, useCreateDocument } from '../hooks/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import type { DocumentTreeNode, Folder as FolderType, Document as DocumentType } from '../types/api'

interface DocumentTreeProps {
  readonly dataRoomId: string
}

interface CreateFolderDialogProps {
  readonly dataRoomId: string
  readonly parentFolderId?: string
}

interface CreateDocumentDialogProps {
  readonly dataRoomId: string
  readonly folderId: string
}

function CreateFolderDialog({ dataRoomId, parentFolderId }: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const createFolderMutation = useCreateFolder()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createFolderMutation.mutateAsync({
        dataRoomId,
        name: name.trim(),
        parentFolderId: parentFolderId || null,
      })
      setName('')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <FolderPlus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFolderMutation.isPending}>
              {createFolderMutation.isPending ? 'Creating...' : 'Create Folder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CreateDocumentDialog({ dataRoomId, folderId }: CreateDocumentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const createDocumentMutation = useCreateDocument()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      await createDocumentMutation.mutateAsync({
        dataRoomId,
        name: name.trim(),
        content: content.trim(),
        folderId,
      })
      setName('')
      setContent('')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <FilePlus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-content">Content</Label>
            <Textarea
              id="document-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter document content"
              rows={6}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDocumentMutation.isPending}>
              {createDocumentMutation.isPending ? 'Creating...' : 'Create Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DocumentTreeNodeItem({ 
  node, 
  dataRoomId, 
  level = 0 
}: { 
  readonly node: DocumentTreeNode
  readonly dataRoomId: string
  readonly level?: number 
}) {
  const [expanded, setExpanded] = useState(level < 2) // Auto-expand first 2 levels

  const hasChildren = node.children.length > 0
  const indent = level * 24

  if (node.type === 'Document') {
    const document = node.data as DocumentType
    return (
      <div 
        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md"
        style={{ marginLeft: indent }}
      >
        <File className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-900 truncate">
          {document.name}
        </span>
        <span className="text-xs text-gray-500 ml-auto">
          {document.content?.length || 0} chars
        </span>
      </div>
    )
  }

  const folder = node.data as FolderType
  
  return (
    <div>
      <div 
        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md group"
        style={{ marginLeft: indent }}
      >
        <button
          onClick={() => hasChildren && setExpanded(!expanded)}
          className="flex items-center gap-1 flex-1 cursor-pointer"
        >
          {hasChildren ? (
            <div className="flex-shrink-0">
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </div>
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}
          
          <Folder className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          
          <span className="text-sm font-medium text-gray-900 truncate">
            {folder.name}
          </span>
          
          <span className="text-xs text-gray-500 ml-auto">
            {node.children.length} item{node.children.length === 1 ? '' : 's'}
          </span>
        </button>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <CreateFolderDialog 
            dataRoomId={dataRoomId} 
            parentFolderId={folder.id} 
          />
          <CreateDocumentDialog 
            dataRoomId={dataRoomId} 
            folderId={folder.id} 
          />
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="space-y-1">
          {node.children.map((child) => (
            <DocumentTreeNodeItem
              key={child.data.id}
              node={child}
              dataRoomId={dataRoomId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function DocumentTree({ dataRoomId }: DocumentTreeProps) {
  const { data: documentTree, isLoading, error } = useDocumentTree(dataRoomId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-md">
        Error loading document tree: {error.message}
      </div>
    )
  }

  console.log('DocumentTree received data:', documentTree)

  if (!documentTree || typeof documentTree !== 'object') {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Document Tree</h3>
        <p className="text-muted-foreground mb-6">
          This data room doesn't have a document tree yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="p-4 space-y-1">
          <DocumentTreeNodeItem
            node={documentTree}
            dataRoomId={dataRoomId}
            level={0}
          />
        </div>
      </div>
    </div>
  )
}