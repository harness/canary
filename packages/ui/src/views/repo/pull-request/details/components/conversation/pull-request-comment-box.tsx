import { useMemo, useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  Button,
  MarkdownViewer,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea
} from '@/components'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/stringUtils'

import { handleFileDrop, handlePaste } from '../../pull-request-utils'

// TODO: add back when functionality is added
// import { ToolbarAction } from '../../pull-request-details-types'
// interface ToolbarItem {
//   icon: IconProps['name']
//   action: ToolbarAction
//   title?: string
//   size?: number
// }
interface PullRequestCommentBoxProps {
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
  hideAvatar?: boolean
  onCancelClick?: () => void
  isResolved?: boolean
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
  parentCommentId?: number
  handleUpload?: (blob: File, setMarkdownContent: (data: string) => void) => void
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
  hideAvatar,
  isResolved,
  onCommentSaveAndStatusChange,
  parentCommentId,
  handleUpload
}: PullRequestCommentBoxProps) => {
  const [__file, setFile] = useState<File>()

  const handleSaveComment = () => {
    if (comment.trim()) {
      onSaveComment(comment)
      setComment('') // Clear the comment box after saving
    }
  }

  const avatar = useMemo(() => {
    return (
      <Avatar size="6">
        {/* <AvatarImage src={AvatarUrl} /> */}
        <AvatarFallback>
          <span className="text-12 text-foreground-3">{getInitials(currentUser || '')}</span>
        </AvatarFallback>
      </Avatar>
    )
  }, [currentUser])

  // TODO: add back when functionality is added
  // const toolbar: ToolbarItem[] = useMemo(() => {
  //  const initial: ToolbarItem[] = []
  //  return [
  //    ...initial,
  //    { icon: 'header', action: ToolbarAction.HEADER },
  //    { icon: 'bold', action: ToolbarAction.BOLD },
  //    { icon: 'italicize', action: ToolbarAction.ITALIC },
  //    { icon: 'attachment', action: ToolbarAction.UPLOAD },
  //    { icon: 'list', action: ToolbarAction.UNORDER_LIST },
  //    { icon: 'checklist', action: ToolbarAction.CHECK_LIST },
  //    { icon: 'code', action: ToolbarAction.CODE_BLOCK }
  //  ]
  // }, [])
  const handleUploadCallback = (file: File) => {
    setFile(file)

    handleUpload?.(file, setComment)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDropForUpload = async (event: any) => {
    handleFileDrop(event, handleUploadCallback)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePasteForUpload = (event: { preventDefault: () => void; clipboardData: any }) => {
    handlePaste(event, handleUploadCallback)
  }

  return (
    <div className="flex items-start space-x-4">
      {(!isEditMode || !hideAvatar) && avatar}
      <div
        className={cn('min-w-0 flex-1 px-4 pb-5 pt-1.5', {
          'border rounded-md': !inReplyMode || isEditMode,
          'border-t ': inReplyMode
        })}
      >
        <Tabs variant="tabnav" defaultValue="write">
          <TabsList className="relative left-1/2 w-[calc(100%+32px)] -translate-x-1/2 px-4">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-4" value="write">
            <div
              onDrop={e => {
                handleDropForUpload(e)
              }}
              onPaste={handlePasteForUpload}
              className="relative gap-y-1"
              onDragOver={event => {
                event.preventDefault()
              }}
            >
              <Textarea
                onDrop={e => {
                  handleDropForUpload(e)
                }}
                onPaste={e => {
                  if (e.clipboardData.files.length > 0) {
                    handlePasteForUpload(e)
                  } else {
                    const pastedText = e.clipboardData.getData('Text')
                    setComment(comment + pastedText)
                  }
                }}
                className="min-h-24 p-3 pb-10"
                autoFocus={!!inReplyMode}
                placeholder="Add your comment here"
                value={comment}
                onChange={e => setComment(e.target.value)}
                resizable
              />
              <p className="pt-1 text-foreground-4">
                Attach images & videos by dragging and dropping,selecting or pasting them.
              </p>

              {/* TODO: add back when functionality is implemented */}
              {/* <div className="absolute pb-2 pt-1 px-1 bottom-px bg-background-1 left-1/2 w-[calc(100%-2px)] -translate-x-1/2 rounded">
                {toolbar.map((item, index) => {
                  return (
                    <Button key={`${comment}-${index}`} size="icon" variant="ghost">
                      <Icon name={item.icon} />
                    </Button>
                  )
                })}
              </div> */}
            </div>
          </TabsContent>
          <TabsContent className="mt-4" value="preview">
            <div className="min-h-24">
              {comment ? <MarkdownViewer source={comment} /> : <span>Nothing to preview</span>}
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex items-center gap-x-3">
          {!inReplyMode && !isEditMode ? (
            <Button onClick={handleSaveComment}>Comment</Button>
          ) : isEditMode ? (
            <>
              <Button onClick={handleSaveComment}>Save</Button>
              <Button variant="outline" onClick={onCancelClick}>
                Cancel
              </Button>
            </>
          ) : (
            <></>
          )}

          {inReplyMode && (
            <>
              {isEditMode ? (
                <Button onClick={handleSaveComment}>Save</Button>
              ) : (
                <Button onClick={handleSaveComment}>Reply</Button>
              )}
              <Button
                variant={'outline'}
                onClick={() => {
                  onCommentSaveAndStatusChange?.(comment, isResolved ? 'active' : 'resolved', parentCommentId)
                  onCancelClick?.()
                }}
              >
                {isResolved ? 'Reply & Reactivate' : 'Reply & Resolve'}
              </Button>
              <Button variant="outline" onClick={onCancelClick}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { PullRequestCommentBox }
