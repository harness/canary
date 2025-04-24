import { ChangeEvent, useRef } from 'react'

import { Button } from '@/components/button'
import { Input } from '@components/input'

export interface FileUploadProps {
  selectedFile?: File
  onFileChange: (file?: File) => void
  error?: string
}

export function FileUpload({ selectedFile, onFileChange, error }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0])
    }
  }

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const removeFile = () => {
    onFileChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0])
    }
  }

  return (
    <div>
      <label htmlFor="secret-file-input" className="mb-2.5 block text-sm font-medium text-cn-foreground-2">
        Secret File
      </label>
      <div
        className="rounded-md border-2 border-dashed border-cn-borders-2 p-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          {!selectedFile ? (
            <>
              <p className="mb-2 text-sm text-cn-foreground-2">Drag and drop your file here or click to browse</p>
              <Button type="button" variant="surface" theme="muted" onClick={openFileInput}>
                Browse Files
              </Button>
            </>
          ) : (
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cn-foreground-2">
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </span>
                <div className="flex gap-2">
                  <Button type="button" variant="surface" theme="muted" size="sm" onClick={openFileInput}>
                    Change
                  </Button>
                  <Button type="button" variant="soft" theme="danger" size="sm" onClick={removeFile}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {error && <div className="mt-1 text-sm text-cn-foreground-danger">{error}</div>}

      {/* Hidden file input */}
      <Input
        id="secret-file-input"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
