import { forwardRef, MouseEvent, useRef, useState } from 'react'
import { FieldErrors, SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'

import { Button, Fieldset, Icon, Input, MarkdownViewer, Tabs, Textarea } from '@/components'
import { CompareFormFields, handleFileDrop, handlePaste, HandleUploadType, TranslationStore } from '@/views'
import { cn } from '@utils/cn'

const TABS_KEYS = {
  WRITE: 'write',
  PREVIEW: 'preview'
}

interface PullRequestFormProps {
  apiError: string | null
  isLoading: boolean
  onFormDraftSubmit: (data: CompareFormFields) => void
  onFormSubmit: (data: CompareFormFields) => void
  isValid: boolean
  errors: FieldErrors<CompareFormFields>
  handleSubmit: UseFormHandleSubmit<CompareFormFields>
  register: UseFormRegister<CompareFormFields>
  useTranslationStore: () => TranslationStore
  handleUpload?: HandleUploadType
  desc?: string
  setDesc: (desc: string) => void
}

const PullRequestCompareForm = forwardRef<HTMLFormElement, PullRequestFormProps>(
  (
    { apiError, register, handleSubmit, errors, onFormSubmit, useTranslationStore, handleUpload, desc, setDesc },
    ref
  ) => {
    const { t } = useTranslationStore()
    const onSubmit: SubmitHandler<CompareFormFields> = data => {
      onFormSubmit(data)
    }
    const [__file, setFile] = useState<File>()

    const [activeTab, setActiveTab] = useState<typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW>(TABS_KEYS.WRITE)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    const handleUploadCallback = (file: File) => {
      setFile(file)

      handleUpload?.(file, setDesc)
    }

    const handleFileSelect = (e: MouseEvent<HTMLButtonElement>) => {
      fileInputRef.current?.click()
      e.stopPropagation()
      e.preventDefault()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleUploadCallback(file)
      }
    }
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.currentTarget === dropZoneRef.current) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.currentTarget === dropZoneRef.current && !e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      handleDropForUpload(e)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDropForUpload = async (event: any) => {
      handleFileDrop(event, handleUploadCallback)
    }

    const handlePasteForUpload = (event: React.ClipboardEvent) => {
      handlePaste(event, handleUploadCallback)
    }
    const handleTabChange = (tab: typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW) => {
      setActiveTab(tab)
    }

    return (
      <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
        <Fieldset className="gap-y-3">
          <Input
            id="title"
            {...register('title')}
            placeholder={t('views:pullRequests.compareChangesFormTitlePlaceholder', 'Enter pull request title')}
            error={errors.title?.message?.toString()}
            autoFocus
            label={t('views:pullRequests.compareChangesFormTitleLabel', 'Title')}
            size="md"
          />

          <div
            className={cn('pb-5 pt-1.5 px-4 flex-1 bg-background-surface border border-borders-2 rounded-md', {
              // 'border rounded-md': !inReplyMode || isEditMode,
              // 'border-t': inReplyMode
            })}
          >
            <Tabs.Root
              variant="tabnav"
              defaultValue={TABS_KEYS.WRITE}
              value={activeTab}
              onValueChange={handleTabChange}
            >
              <Tabs.List className="relative left-1/2 w-[calc(100%+var(--tab-width))] -translate-x-1/2 px-4">
                <Tabs.Trigger className="data-[state=active]:bg-background-1" value={TABS_KEYS.WRITE}>
                  Write
                </Tabs.Trigger>
                <Tabs.Trigger className="data-[state=active]:bg-background-1" value={TABS_KEYS.PREVIEW}>
                  Preview
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content className="mt-4" value={TABS_KEYS.WRITE}>
                <div
                  className="relative"
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  ref={dropZoneRef}
                >
                  <Textarea
                    id="description"
                    {...register('description')}
                    value={desc}
                    onChange={e => {
                      setDesc(e.target.value)
                    }}
                    placeholder={t(
                      'views:pullRequests.compareChangesFormDescriptionPlaceholder',
                      'Add Pull Request description here.'
                    )}
                    onPaste={e => {
                      if (e.clipboardData.files.length > 0) {
                        handlePasteForUpload(e)
                      }
                    }}
                    label={t('views:pullRequests.compareChangesFormDescriptionLabel', 'Description')}
                    error={errors.description?.message?.toString()}
                  />
                  {isDragging && (
                    <div className="border-borders-2 absolute inset-1 cursor-copy rounded-sm border border-dashed" />
                  )}
                </div>
              </Tabs.Content>
              <Tabs.Content className="mt-4" value={TABS_KEYS.PREVIEW}>
                <div className="min-h-24">
                  {desc ? (
                    <MarkdownViewer markdownClassName="!bg-background-2" source={desc} />
                  ) : (
                    <span>Nothing to preview</span>
                  )}
                </div>
              </Tabs.Content>
            </Tabs.Root>

            <div className="mt-4 flex items-center justify-between">
              {activeTab === TABS_KEYS.WRITE && (
                <div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                  <Button
                    className="text-foreground-3 hover:bg-background-8 gap-x-2 px-2.5 font-normal"
                    variant="custom"
                    onClick={e => handleFileSelect(e)}
                  >
                    <Icon size={16} name="attachment-image" />
                    <span>Drag & drop, select, or paste to attach files</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Fieldset>

        {apiError && apiError !== "head branch doesn't contain any new commits." && (
          <span className="text-12 text-destructive">{apiError?.toString()}</span>
        )}
      </form>
    )
  }
)

PullRequestCompareForm.displayName = 'PullRequestCompareForm'

export default PullRequestCompareForm
