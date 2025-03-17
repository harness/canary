import { ChangeEvent, useRef } from 'react'

import { Button, Icon, Input, Text } from '@/components'

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
      <div
        className="rounded-md border-2 border-dashed border-cn-borders-2 p-4"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div
          className="flex flex-col items-center justify-center gap-2 py-3"
          onClick={openFileInput}
          role="button"
          tabIndex={0}
        >
          {!selectedFile ? (
            <>
              <Icon name="upload" />
              <Text className="text-cn-foreground-1">Click to browse or drag and drop a file</Text>
              <Text className="text-cn-foreground-2">Up to 50MB</Text>
            </>
          ) : (
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cn-foreground-2">
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="surface"
                    theme="muted"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      openFileInput()
                    }}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    variant="soft"
                    theme="danger"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation()
                      removeFile()
                    }}
                  >
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
