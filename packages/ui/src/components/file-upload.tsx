import { ChangeEvent, useRef, useState } from 'react'

import { formatBytes } from '@/utils'

import { Button } from './button'
import { Card } from './card'
import { IconV2 } from './icon-v2'
import { Input } from './input'
import { Layout } from './layout'
import { Text } from './text'

const DEFAULT_MAX_SIZE_BYTES = 50 * 1024 * 1024

export interface FileUploadProps {
  selectedFile?: File
  onFileChange: (file?: File) => void
  error?: string
  accept?: string
  /** Max size hint in bytes. Defaults to 50 MiB ("Up to 50 MB"). */
  maxSizeBytes?: number
}

export function FileUpload({
  selectedFile,
  onFileChange,
  error,
  accept,
  maxSizeBytes = DEFAULT_MAX_SIZE_BYTES
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
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
    setIsLoading(false)
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
    setIsLoading(true)
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
          className="rounded-cn-3 border-2 border-dashed border-cn-2 p-cn-xl"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-cn-xs">
              <IconV2 className="mb-cn-md animate-spin" name="loader" size="xl" />
              <Text variant="heading-base">Loading...</Text>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-cn-xs" onClick={openFileInput} role="button" tabIndex={0}>
              <IconV2 name="cloud-upload" size="xl" className="mb-cn-md" />
              <Text variant="heading-base">Click to browse or drag and drop a file</Text>
              <Text variant="body-single-line-normal">Up to {formatBytes(maxSizeBytes)}</Text>
            </div>
          )}
        </div>
      ) : (
        <Card.Root orientation="horizontal" size="sm" className="w-full" wrapperClassname="w-full">
          <Card.Content className="w-full">
            <Layout.Flex direction="row" align="center" justify="between" className="w-full">
              <Layout.Flex direction="row" gap="xs" align="center">
                <div className="rounded border bg-cn-1 p-cn-xs">
                  <IconV2 name="empty-page" size="lg" />
                </div>
                <Layout.Vertical align="start" gap="none">
                  <Text variant="body-strong" color="foreground-1">
                    {selectedFile?.name}
                  </Text>
                  <Text variant="body-normal" color="foreground-3">
                    {formatBytes(selectedFile.size)}
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
        <Text color="danger" className="mt-cn-3xs">
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
