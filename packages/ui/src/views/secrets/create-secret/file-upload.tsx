import { ChangeEvent, useRef } from 'react'

import { Button, Card, IconV2, Input, Layout, Text } from '@/components'

export interface FileUploadProps {
  selectedFile?: File
  onFileChange: (file?: File) => void
  error?: string
  accept?: string
}

export function FileUpload({ selectedFile, onFileChange, error, accept }: FileUploadProps) {
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

  const removeFile = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
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
      {!selectedFile ? (
        <div
          className="rounded-3 border-2 border-dashed border-cn-2 p-cn-xl"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col gap-cn-xs items-center" onClick={openFileInput} role="button" tabIndex={0}>
            <IconV2 name="cloud-upload" size="xl" className="mb-cn-md" />
            <Text variant="heading-base">Click to browse or drag and drop a file</Text>
            <Text variant="body-single-line-normal">Up to 50MB</Text>
          </div>
        </div>
      ) : (
        <Card.Root orientation="horizontal" size="sm" className="w-full" wrapperClassname="w-full">
          <Card.Content className="w-full">
            <Layout.Flex direction="row" align="center" justify="between" className="w-full">
              <Layout.Flex direction="row" gap="xs" align="center">
                <div className="p-cn-xs bg-cn-1 rounded border">
                  <IconV2 name="empty-page" size="lg" />
                </div>
                <Layout.Vertical align="start" gap="none">
                  <Text variant="body-strong" color="foreground-1">
                    {selectedFile?.name}
                  </Text>
                  <Text variant="body-normal" color="foreground-3">
                    {Math.round(selectedFile?.size / 1024)} KB
                  </Text>
                </Layout.Vertical>
              </Layout.Flex>
              <Button variant="ghost" iconOnly onClick={e => removeFile(e)} ignoreIconOnlyTooltip>
                <IconV2 name="xmark" size="md" />
              </Button>
            </Layout.Flex>
          </Card.Content>
        </Card.Root>
      )}
      {error && (
        <Text as="div" color="danger" className="mt-cn-3xs">
          {error}
        </Text>
      )}

      {/* Hidden file input */}
      <Input
        id="secret-file-input"
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}
