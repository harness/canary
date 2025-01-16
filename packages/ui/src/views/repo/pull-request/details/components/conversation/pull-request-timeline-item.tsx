import { memo, useEffect, useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon,
  Input,
  NodeGroup,
  Text
} from '@components/index'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/utils'

import { PullRequestCommentBox } from './pull-request-comment-box'

interface TimelineItemProps {
  header: {
    avatar?: React.ReactNode
    name?: string
    description?: React.ReactNode
    selectStatus?: React.ReactNode
  }[]
  parentCommentId?: number
  commentId?: number
  currentUser?: string
  content?: React.ReactNode
  icon?: React.ReactNode
  isLast: boolean
  isComment?: boolean
  hideIconBorder?: boolean
  hideReplySection?: boolean
  contentClassName?: string
  replyBoxClassName?: string
  titleClassName?: string
  handleSaveComment?: (comment: string, parentId?: number) => void
  onEditClick?: () => void
  onCopyClick?: (commentId?: number, isNotCodeComment?: boolean) => void
  isEditMode?: boolean
  handleDeleteComment?: () => void
  isDeleted?: boolean
  isNotCodeComment?: boolean
  hideReplyHere?: boolean
  setHideReplyHere?: (state: boolean) => void
  id?: string
  isResolved?: boolean
  toggleConversationStatus?: (status: string, parentId?: number) => void
  onCommentSaveAndStatusChange?: (comment: string, status: string, parentId?: number) => void
  data?: string
  handleUpload?: (blob: File, setMarkdownContent: (data: string) => void) => void
  onQuoteReply?: (parentId: number, rawText: string) => void
  quoteReplyText?: string
}

interface ItemHeaderProps {
  avatar?: React.ReactNode
  name?: string
  isComment?: boolean
  description?: React.ReactNode
  selectStatus?: React.ReactNode
  onEditClick?: () => void
  onCopyClick?: (commentId?: number, isNotCodeComment?: boolean) => void
  commentId?: number
  handleDeleteComment?: () => void
  isDeleted?: boolean
  isNotCodeComment?: boolean
  onQuoteReply?: () => void
}

const ItemHeader: React.FC<ItemHeaderProps> = memo(
  ({
    onEditClick,
    onCopyClick,
    commentId,
    avatar,
    name,
    description,
    selectStatus,
    isComment,
    handleDeleteComment,
    isDeleted = false,
    isNotCodeComment = false,
    onQuoteReply
  }) => {
    const renderMenu = () => {
      // We only show the menu if it's an actual comment and not deleted
      if (!isComment || isDeleted) return null
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1">
              <Icon name="vertical-ellipsis" size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] rounded-[10px] border bg-background-2 py-2 shadow-sm">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onEditClick} className="cursor-pointer">
                <DropdownMenuShortcut className="ml-0" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onQuoteReply?.()
                }}
                className="cursor-pointer"
              >
                <DropdownMenuShortcut className="ml-0" />
                Quote reply
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => onCopyClick?.(commentId, isNotCodeComment)}>
                <DropdownMenuShortcut className="ml-0" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={ev => {
                  ev.stopPropagation()
                  handleDeleteComment?.()
                }}
              >
                <DropdownMenuShortcut className="ml-0">
                  <Icon name="trash" className="mr-2 text-destructive" />
                </DropdownMenuShortcut>
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return (
      <div className="inline-flex w-full items-center justify-between gap-1.5">
        <div className="inline-flex items-center gap-1.5">
          {avatar && <div>{avatar}</div>}
          {name && (
            <Text size={2} color="primary" weight="medium">
              {name}
            </Text>
          )}
          {description && (
            <Text size={2} color="tertiaryBackground">
              {description}
            </Text>
          )}
        </div>
        {selectStatus && (
          <div className="justify-end">
            <Text size={2} color="tertiaryBackground">
              {selectStatus}
            </Text>
          </div>
        )}
        {renderMenu()}
      </div>
    )
  }
)
ItemHeader.displayName = 'ItemHeader'

const PullRequestTimelineItem: React.FC<TimelineItemProps> = ({
  header,
  content,
  icon,
  isLast,
  hideIconBorder,
  hideReplySection = false,
  contentClassName,
  replyBoxClassName,
  handleSaveComment,
  commentId,
  parentCommentId,
  titleClassName,
  isComment,
  onEditClick,
  onCopyClick,
  isEditMode,
  handleDeleteComment,
  isDeleted = false,
  hideReplyHere,
  setHideReplyHere,
  currentUser,
  id,
  isResolved,
  toggleConversationStatus,
  onCommentSaveAndStatusChange,
  isNotCodeComment,
  data,
  handleUpload,
  onQuoteReply,
  quoteReplyText
}) => {
  const [comment, setComment] = useState('')
  useEffect(() => {
    if (quoteReplyText) setComment(quoteReplyText)
  }, [quoteReplyText])

  return (
    <div id={id}>
      <NodeGroup.Root>
        {icon && <NodeGroup.Icon className={cn({ 'border-transparent': hideIconBorder })}>{icon}</NodeGroup.Icon>}
        <NodeGroup.Title className={titleClassName}>
          {/* Ensure that header has at least one item */}
          {header.length > 0 && (
            <ItemHeader
              isDeleted={isDeleted}
              onEditClick={onEditClick}
              onCopyClick={onCopyClick}
              isComment={isComment}
              isNotCodeComment={isNotCodeComment}
              handleDeleteComment={handleDeleteComment}
              commentId={commentId}
              {...header[0]}
              onQuoteReply={() => {
                setHideReplyHere?.(true)
                if (parentCommentId) onQuoteReply?.(parentCommentId, data ?? '')
              }}
            />
          )}
        </NodeGroup.Title>
        {content && (
          <NodeGroup.Content>
            <Card className={cn('rounded-md bg-transparent', contentClassName)}>
              {isEditMode ? (
                <PullRequestCommentBox
                  handleUpload={handleUpload}
                  isEditMode
                  onSaveComment={() => {
                    handleSaveComment?.(comment, parentCommentId)
                    setComment('')
                  }}
                  currentUser={currentUser}
                  onCancelClick={() => {
                    setComment('')
                  }}
                  isResolved={isResolved}
                  comment={comment}
                  setComment={setComment}
                />
              ) : (
                content
              )}
              {!hideReplySection && (
                <>
                  {hideReplyHere ? (
                    <div className="flex w-full flex-col px-4">
                      <PullRequestCommentBox
                        handleUpload={handleUpload}
                        inReplyMode
                        onSaveComment={() => {
                          handleSaveComment?.(comment, parentCommentId)
                          setHideReplyHere?.(false)
                        }}
                        currentUser={currentUser}
                        onCancelClick={() => {
                          setHideReplyHere?.(false)
                        }}
                        comment={comment}
                        isResolved={isResolved}
                        setComment={setComment}
                        parentCommentId={parentCommentId}
                        onCommentSaveAndStatusChange={onCommentSaveAndStatusChange}
                      />
                    </div>
                  ) : (
                    <>
                      <div className={cn('flex items-center gap-3 border-t', replyBoxClassName)}>
                        {currentUser ? (
                          <Avatar className="size-6 rounded-full p-0">
                            <AvatarFallback>
                              <Text size={1} color="tertiaryBackground">
                                {getInitials(currentUser ?? '', 2)}
                              </Text>
                            </AvatarFallback>
                          </Avatar>
                        ) : null}
                        <Input
                          placeholder="Reply here"
                          size="md"
                          onClick={() => {
                            setHideReplyHere?.(true)
                          }}
                          onChange={e => {
                            setComment(e.target.value)
                          }}
                        />
                      </div>
                      <div className={cn('flex gap-3 border-t', replyBoxClassName)}>
                        <Button
                          variant={'outline'}
                          onClick={() => {
                            toggleConversationStatus?.(isResolved ? 'active' : 'resolved', parentCommentId)
                          }}
                        >
                          {isResolved ? 'Reactivate' : 'Resolve Conversation'}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>
          </NodeGroup.Content>
        )}
        {!isLast && <NodeGroup.Connector />}
      </NodeGroup.Root>
    </div>
  )
}

export default PullRequestTimelineItem
