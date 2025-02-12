import { Fragment, useMemo, useRef, useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  Button,
  Icon,
  IconProps,
  MarkdownViewer,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea
} from '@/components'
import { handleFileDrop, handlePaste, ToolbarAction } from '@/views'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'

interface ToolbarItem {
  icon: IconProps['name']
  action: ToolbarAction
  title?: string
  size?: number
  onClick?: () => void
}

export interface PullRequestCommentBoxProps {
  onSaveComment: (comment: string) => void
  comment: string
  setComment: (comment: string) => void
  currentUser?: string
  onBoldClick?: () => void
  onItalicClick?: () => void
  onLinkClick?: () => void
  onCodeClick?: () => void
  onCommentSubmit?: () => void
  inReplyMode?: boolean
  isEditMode?: boolean
  onCancelClick?: () => void
  handleUpload?: (blob: File, setMarkdownContent: (data: string) => void) => void
}

const TABS_KEYS = {
  WRITE: 'write',
  PREVIEW: 'preview'
}

//  TODO: will have to eventually implement a commenting and reply system similiar to gitness
const PullRequestCommentBox = ({
  onSaveComment,
  currentUser,
  inReplyMode = false,
  onCancelClick,
  comment,
  setComment,
  isEditMode,
  handleUpload
}: PullRequestCommentBoxProps) => {
  const [__file, setFile] = useState<File>()
  const [activeTab, setActiveTab] = useState<typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW>(TABS_KEYS.WRITE)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleSaveComment = () => {
    if (comment.trim()) {
      onSaveComment(comment)
      setComment('') // Clear the comment box after saving
    }
  }

  const avatar = useMemo(() => {
    return (
      <Avatar size="6">
        <AvatarFallback>
          <span className="text-12 text-foreground-1">{getInitials(currentUser || '')}</span>
        </AvatarFallback>
      </Avatar>
    )
  }, [currentUser])

  const handleUploadCallback = (file: File) => {
    setFile(file)

    handleUpload?.(file, setComment)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
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

  // TODO: add the remaining required logic for the toolbar
  const toolbar: ToolbarItem[] = useMemo(() => {
    const initial: ToolbarItem[] = []
    return [
      ...initial,
      { icon: 'suggestion', action: ToolbarAction.SUGGESTION },
      { icon: 'header', action: ToolbarAction.HEADER },
      { icon: 'bold', action: ToolbarAction.BOLD },
      { icon: 'italicize', action: ToolbarAction.ITALIC },
      { icon: 'attachment', action: ToolbarAction.UPLOAD, onClick: handleFileSelect },
      { icon: 'list', action: ToolbarAction.UNORDER_LIST },
      { icon: 'checklist', action: ToolbarAction.CHECK_LIST },
      { icon: 'code', action: ToolbarAction.CODE_BLOCK }
    ]
  }, [])

  const handleTabChange = (tab: typeof TABS_KEYS.WRITE | typeof TABS_KEYS.PREVIEW) => {
    setActiveTab(tab)
  }

  return (
    <div className="flex items-start gap-x-3 font-sans" data-comment-editor-shown="true">
      {!inReplyMode && !isEditMode && avatar}
      <div
        className={cn('pb-4 pt-1.5 px-4 flex-1 bg-background-2 border-border-1 overflow-auto', {
          'border rounded-md': !inReplyMode || isEditMode,
          'border-t': inReplyMode
        })}
      >
        <Tabs variant="tabnav" defaultValue={TABS_KEYS.WRITE} value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="relative left-1/2 w-[calc(100%+var(--tab-width))] -translate-x-1/2 px-4">
            <TabsTrigger className="data-[state=active]:bg-background-2" value={TABS_KEYS.WRITE}>
              Write
            </TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-background-2" value={TABS_KEYS.PREVIEW}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-4" value={TABS_KEYS.WRITE}>
            <div
              className="relative"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              ref={dropZoneRef}
            >
              <Textarea
                className="min-h-24 bg-background-2 p-3 pb-10 text-foreground-1"
                autoFocus={!!inReplyMode}
                placeholder="Add your comment here"
                value={comment}
                onChange={e => setComment(e.target.value)}
                onPaste={e => {
                  if (e.clipboardData.files.length > 0) {
                    handlePasteForUpload(e)
                  }
                }}
                resizable
              />
              {isDragging && (
                <div className="absolute inset-1 cursor-copy rounded-sm border border-dashed border-borders-2" />
              )}

              <div className="absolute bottom-px left-1/2 -ml-0.5 flex w-[calc(100%-16px)] -translate-x-1/2 items-center bg-background-2 pb-2 pt-1">
                {toolbar.map((item, index) => {
                  const isFirst = index === 0
                  return (
                    <Fragment key={`${comment}-${index}`}>
                      <Button className="hover:bg-background-8" size="icon" variant="ghost" onClick={item?.onClick}>
                        <Icon className="text-icons-9" name={item.icon} />
                      </Button>
                      {isFirst && <div className="h-4 w-px bg-borders-2" />}
                    </Fragment>
                  )
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent className="mt-4 w-full" value={TABS_KEYS.PREVIEW}>
            <div className="min-h-24 w-full">
              {comment ? (
                <MarkdownViewer markdownClassName="!bg-background-2 w-full" source={comment} />
              ) : (
                <span className="text-foreground-8">Nothing to preview</span>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-center justify-between">
          {activeTab === TABS_KEYS.WRITE && (
            <div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <Button
                className="gap-x-2 px-2.5 font-normal text-foreground-3 hover:bg-background-8"
                variant="custom"
                onClick={handleFileSelect}
              >
                <Icon size={16} name="attachment-image" />
                <span>Drag & drop, select, or paste to attach files</span>
              </Button>
            </div>
          )}

          <div className="ml-auto flex gap-x-3">
            {(inReplyMode || isEditMode) && (
              <Button variant="outline" onClick={onCancelClick}>
                Cancel
              </Button>
            )}

            {isEditMode ? (
              <Button onClick={handleSaveComment}>Save</Button>
            ) : (
              <Button onClick={handleSaveComment}>Comment</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { PullRequestCommentBox }
