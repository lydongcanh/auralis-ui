import { useState } from 'react'
import { ChevronDown, ChevronRight, File, Folder, FolderPlus, FilePlus, Upload, X } from 'lucide-react'
import { Button } from '../ui/button'
import { LoadingSpinner } from '../common'
import { useDocumentTree, useCreateFolder, useCreateDocument } from '../../hooks/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import type { DocumentTreeNode, Folder as FolderType, Document as DocumentType } from '../../types/api'
import { createWorker } from 'tesseract.js'

// Tesseract.js supported languages
const OCR_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'afr', name: 'Afrikaans' },
  { code: 'amh', name: 'Amharic' },
  { code: 'ara', name: 'Arabic' },
  { code: 'asm', name: 'Assamese' },
  { code: 'aze', name: 'Azerbaijani' },
  { code: 'bel', name: 'Belarusian' },
  { code: 'ben', name: 'Bengali' },
  { code: 'bod', name: 'Tibetan' },
  { code: 'bos', name: 'Bosnian' },
  { code: 'bul', name: 'Bulgarian' },
  { code: 'cat', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'ces', name: 'Czech' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'chr', name: 'Cherokee' },
  { code: 'cym', name: 'Welsh' },
  { code: 'dan', name: 'Danish' },
  { code: 'deu', name: 'German' },
  { code: 'dzo', name: 'Dzongkha' },
  { code: 'ell', name: 'Greek' },
  { code: 'enm', name: 'English (Middle)' },
  { code: 'epo', name: 'Esperanto' },
  { code: 'est', name: 'Estonian' },
  { code: 'eus', name: 'Basque' },
  { code: 'fas', name: 'Persian' },
  { code: 'fin', name: 'Finnish' },
  { code: 'fra', name: 'French' },
  { code: 'frk', name: 'German (Fraktur)' },
  { code: 'frm', name: 'French (Middle)' },
  { code: 'gle', name: 'Irish' },
  { code: 'glg', name: 'Galician' },
  { code: 'grc', name: 'Greek (Ancient)' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'hat', name: 'Haitian' },
  { code: 'heb', name: 'Hebrew' },
  { code: 'hin', name: 'Hindi' },
  { code: 'hrv', name: 'Croatian' },
  { code: 'hun', name: 'Hungarian' },
  { code: 'iku', name: 'Inuktitut' },
  { code: 'ind', name: 'Indonesian' },
  { code: 'isl', name: 'Icelandic' },
  { code: 'ita', name: 'Italian' },
  { code: 'ita_old', name: 'Italian (Old)' },
  { code: 'jav', name: 'Javanese' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kan', name: 'Kannada' },
  { code: 'kat', name: 'Georgian' },
  { code: 'kat_old', name: 'Georgian (Old)' },
  { code: 'kaz', name: 'Kazakh' },
  { code: 'khm', name: 'Khmer' },
  { code: 'kir', name: 'Kirghiz' },
  { code: 'kor', name: 'Korean' },
  { code: 'kur', name: 'Kurdish' },
  { code: 'lao', name: 'Lao' },
  { code: 'lat', name: 'Latin' },
  { code: 'lav', name: 'Latvian' },
  { code: 'lit', name: 'Lithuanian' },
  { code: 'mal', name: 'Malayalam' },
  { code: 'mar', name: 'Marathi' },
  { code: 'mkd', name: 'Macedonian' },
  { code: 'mlt', name: 'Maltese' },
  { code: 'msa', name: 'Malay' },
  { code: 'mya', name: 'Burmese' },
  { code: 'nep', name: 'Nepali' },
  { code: 'nld', name: 'Dutch' },
  { code: 'nor', name: 'Norwegian' },
  { code: 'ori', name: 'Oriya' },
  { code: 'pan', name: 'Punjabi' },
  { code: 'pol', name: 'Polish' },
  { code: 'por', name: 'Portuguese' },
  { code: 'pus', name: 'Pashto' },
  { code: 'ron', name: 'Romanian' },
  { code: 'rus', name: 'Russian' },
  { code: 'san', name: 'Sanskrit' },
  { code: 'sin', name: 'Sinhala' },
  { code: 'slk', name: 'Slovak' },
  { code: 'slv', name: 'Slovenian' },
  { code: 'spa', name: 'Spanish' },
  { code: 'spa_old', name: 'Spanish (Old)' },
  { code: 'sqi', name: 'Albanian' },
  { code: 'srp', name: 'Serbian' },
  { code: 'srp_latn', name: 'Serbian (Latin)' },
  { code: 'swa', name: 'Swahili' },
  { code: 'swe', name: 'Swedish' },
  { code: 'syr', name: 'Syriac' },
  { code: 'tam', name: 'Tamil' },
  { code: 'tel', name: 'Telugu' },
  { code: 'tgk', name: 'Tajik' },
  { code: 'tgl', name: 'Tagalog' },
  { code: 'tha', name: 'Thai' },
  { code: 'tir', name: 'Tigrinya' },
  { code: 'tur', name: 'Turkish' },
  { code: 'uig', name: 'Uighur' },
  { code: 'ukr', name: 'Ukrainian' },
  { code: 'urd', name: 'Urdu' },
  { code: 'uzb', name: 'Uzbek' },
  { code: 'uzb_cyrl', name: 'Uzbek (Cyrillic)' },
  { code: 'vie', name: 'Vietnamese' },
  { code: 'yid', name: 'Yiddish' },
] as const

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('eng')
  const createDocumentMutation = useCreateDocument()

  // Supported file types for OCR - Tesseract.js supports common image formats
  // Note: PDF files are not supported as they require conversion to images first
  const SUPPORTED_IMAGE_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/gif',
  ])
  const SUPPORTED_FILE_EXTENSIONS = '.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.gif'

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file type is supported
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      alert('Please select a supported image file (PNG, JPEG, WEBP, BMP, TIFF, or GIF)')
      return
    }

    setSelectedFile(file)
    
    // Auto-fill document name from filename if empty
    if (!name.trim()) {
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setName(fileNameWithoutExt)
    }

    // Start OCR processing
    await performOCR(file)
  }

  const performOCR = async (file: File) => {
    setIsProcessing(true)
    setOcrProgress(0)

    try {
      const worker = await createWorker(selectedLanguage, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100))
          }
        },
      })

      const { data } = await worker.recognize(file)
      setContent(data.text)

      await worker.terminate()
    } catch (error) {
      console.error('OCR processing failed:', error)
      alert('Failed to process file. Please try again or enter content manually.')
    } finally {
      setIsProcessing(false)
      setOcrProgress(0)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setContent('')
  }

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
      setSelectedFile(null)
      setOpen(false)
    } catch (error) {
      console.error('Failed to create document:', error)
    }
  }

  const handleDialogChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when closing
      setName('')
      setContent('')
      setSelectedFile(null)
      setIsProcessing(false)
      setOcrProgress(0)
      setSelectedLanguage('eng')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
          <FilePlus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Language Selection */}
          <div className="space-y-2">
            <Label htmlFor="ocr-language">OCR Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="ocr-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {OCR_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the primary language in the document for better OCR accuracy
            </p>
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="document-file">Upload File for OCR (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="document-file"
                type="file"
                accept={SUPPORTED_FILE_EXTENSIONS}
                onChange={handleFileChange}
                disabled={isProcessing}
                className="flex-1"
              />
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PNG, JPEG, WEBP, BMP, TIFF, GIF
            </p>
          </div>

          {/* OCR Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing image...</span>
                <span className="font-medium">{ocrProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Selected File Preview */}
          {selectedFile && !isProcessing && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Upload className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-900 flex-1">{selectedFile.name}</span>
              <span className="text-xs text-blue-700">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="document-content">Content</Label>
            <Textarea
              id="document-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter document content or upload an image for OCR"
              rows={10}
              disabled={isProcessing}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleDialogChange(false)}
              disabled={isProcessing || createDocumentMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing || createDocumentMutation.isPending}
            >
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