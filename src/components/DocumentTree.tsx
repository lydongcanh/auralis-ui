import { useDocumentTree, useCreateFolder, useCreateDocument } from '../hooks/api'
import { Folder, File, FolderPlus, FileText } from 'lucide-react'
import { LoadingSpinner } from './LoadingSpinner'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { Folder as FolderType, Document as DocumentType } from '../types/api'
import { useState } from 'react'

interface DocumentTreeProps {
  readonly dataRoomId: string
}

function CreateFolderDialog({ dataRoomId, folders }: { readonly dataRoomId: string; readonly folders: FolderType[] }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [parentFolderId, setParentFolderId] = useState<string | null>(null)
  const createFolder = useCreateFolder()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createFolder.mutateAsync({
        dataRoomId,
        name: name.trim(),
        parentFolderId
      })
      setName('')
      setParentFolderId(null)
      setOpen(false)
    } catch (error) {
      console.error('Failed to create folder:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="Enter folder name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parent-folder">Parent Folder (Optional)</Label>
            <Select value={parentFolderId || 'root'} onValueChange={(value) => setParentFolderId(value === 'root' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root Folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createFolder.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createFolder.isPending || !name.trim()}>
              {createFolder.isPending ? 'Creating...' : 'Create Folder'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CreateDocumentDialog({ dataRoomId, folders }: { readonly dataRoomId: string; readonly folders: FolderType[] }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [folderId, setFolderId] = useState<string>('')
  const createDocument = useCreateDocument()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createDocument.mutateAsync({
        dataRoomId,
        name: name.trim(),
        content: content.trim(),
        folderId
      })
      setName('')
      setContent('')
      setFolderId('')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              placeholder="Enter document name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder-select">Folder</Label>
            <Select value={folderId} onValueChange={setFolderId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-content">Content</Label>
            <Textarea
              id="document-content"
              placeholder="Enter document content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createDocument.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createDocument.isPending || !name.trim() || !folderId || !content.trim()}>
              {createDocument.isPending ? 'Creating...' : 'Create Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FolderItem({ folder, documents }: { readonly folder: FolderType; readonly documents: DocumentType[] }) {
  const folderDocuments = documents.filter(doc => doc.folder_id === folder.id)
  
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <Folder className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{folder.name}</h4>
          <p className="text-xs text-gray-500">
            {folderDocuments.length} document{folderDocuments.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>
      
      {folderDocuments.length > 0 && (
        <div className="p-2">
          {folderDocuments.map((document) => (
            <div key={document.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
              <File className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{document.name}</p>
                <p className="text-xs text-gray-500 truncate">{document.content.substring(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RootDocuments({ documents }: { readonly documents: DocumentType[] }) {
  if (documents.length === 0) return null
  
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <Folder className="h-5 w-5 text-gray-600 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">Root Documents</h4>
          <p className="text-xs text-gray-500">
            {documents.length} document{documents.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>
      
      <div className="p-2">
        {documents.map((document) => (
          <div key={document.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
            <File className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{document.name}</p>
              <p className="text-xs text-gray-500 truncate">{document.content.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
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

  // Add debugging
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

  // Safe destructuring with proper type checking
  const folders = Array.isArray(documentTree.folders) ? documentTree.folders : []
  const documents = Array.isArray(documentTree.documents) ? documentTree.documents : []
  
  // Separate documents without folder_id (root documents)
  const rootDocuments = documents.filter(doc => !folders.some(folder => folder.id === doc.folder_id))
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Document Tree</h2>
        <div className="flex items-center gap-2">
          <CreateFolderDialog dataRoomId={dataRoomId} folders={folders} />
          {folders.length > 0 && (
            <CreateDocumentDialog dataRoomId={dataRoomId} folders={folders} />
          )}
        </div>
      </div>

      {folders.length === 0 && documents.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
          <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Empty Document Tree</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating your first folder to organize documents.
          </p>
          <CreateFolderDialog dataRoomId={dataRoomId} folders={folders} />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Root documents */}
          <RootDocuments documents={rootDocuments} />
          
          {/* Folders with their documents */}
          {folders.map((folder) => (
            <FolderItem key={folder.id} folder={folder} documents={documents} />
          ))}
        </div>
      )}
    </div>
  )
}