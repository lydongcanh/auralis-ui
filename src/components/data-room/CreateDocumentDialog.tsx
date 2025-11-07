import { useState } from 'react'
import { FilePlus, Upload, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useCreateDocument } from '../../hooks/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { createWorker } from 'tesseract.js'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker - use the local worker file served from the build
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

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

interface CreateDocumentDialogProps {
  readonly dataRoomId: string
  readonly folderId: string
}

export function CreateDocumentDialog({ dataRoomId, folderId }: CreateDocumentDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('eng')
  const createDocumentMutation = useCreateDocument()

  // Supported file types for OCR - Tesseract.js supports common image formats + PDF
  const SUPPORTED_IMAGE_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/gif',
    'application/pdf',
  ])
  const SUPPORTED_FILE_EXTENSIONS = '.png,.jpg,.jpeg,.webp,.bmp,.tiff,.tif,.gif,.pdf'

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file type is supported
    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      alert('Please select a supported file (PNG, JPEG, WEBP, BMP, TIFF, GIF, or PDF)')
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

  const convertPdfToImages = async (pdfFile: File): Promise<string[]> => {
    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const images: string[] = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2 }) // Higher scale for better OCR
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) continue

      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      }).promise

      images.push(canvas.toDataURL('image/png'))
    }

    return images
  }

  const performOCR = async (file: File) => {
    setIsProcessing(true)
    setOcrProgress(0)

    try {
      let extractedText = ''

      // Check if file is PDF
      if (file.type === 'application/pdf') {
        const images = await convertPdfToImages(file)
        
        // Create worker without logger to avoid progress conflicts
        const worker = await createWorker(selectedLanguage)
        
        for (let i = 0; i < images.length; i++) {
          // Calculate progress: each page gets equal weight
          const pageProgress = ((i / images.length) * 100)
          setOcrProgress(Math.round(pageProgress))
          
          const { data } = await worker.recognize(images[i])
          extractedText += `\n--- Page ${i + 1} ---\n${data.text}\n`
          
          // Update progress after page is complete
          setOcrProgress(Math.round(((i + 1) / images.length) * 100))
        }
        
        await worker.terminate()
      } else {
        // Regular image file - use logger for single image
        const worker = await createWorker(selectedLanguage, 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100))
            }
          },
        })
        
        const { data } = await worker.recognize(file)
        extractedText = data.text
        await worker.terminate()
      }

      setContent(extractedText)
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
              Supported formats: PNG, JPEG, WEBP, BMP, TIFF, GIF, PDF (all pages will be processed)
            </p>
          </div>

          {/* OCR Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedFile?.type === 'application/pdf' ? 'Processing PDF pages...' : 'Processing image...'}
                </span>
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
