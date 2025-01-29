import { Children, FC, memo, ReactElement, ReactNode, useEffect, useState } from 'react'

import { Avatar, AvatarFallback, Button, Card, DropdownMenu, Icon, Input, NodeGroup, Text } from '@/components'
import { cn } from '@utils/cn'
import { getInitials } from '@utils/utils'

import { PullRequestCommentBox } from './pull-request-comment-box'

interface TimelineItemProps {
  header: {
    avatar?: ReactNode
    name?: string
    description?: ReactNode
    selectStatus?: ReactNode
  }[]
  parentCommentId?: number
  commentId?: number
  currentUser?: string
  contentHeader?: ReactNode
  content?: ReactNode
  icon?: ReactNode
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
  data?: string
  handleUpload?: (blob: File, setMarkdownContent: (data: string) => void) => void
  onQuoteReply?: (parentId: number, rawText: string) => void
  quoteReplyText?: string
}

interface ItemHeaderProps {
  avatar?: ReactNode
  name?: string
  isComment?: boolean
  description?: ReactNode
  selectStatus?: ReactNode
  onEditClick?: () => void
  onCopyClick?: (commentId?: number, isNotCodeComment?: boolean) => void
  commentId?: number
  handleDeleteComment?: () => void
  isDeleted?: boolean
  isNotCodeComment?: boolean
  onQuoteReply?: () => void
}

const ItemHeader: FC<ItemHeaderProps> = memo(
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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1">
              <Icon name="vertical-ellipsis" size={12} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-[180px] rounded-[10px] border bg-background-2 py-2 shadow-sm">
            <DropdownMenu.Group>
              <DropdownMenu.Item onClick={onEditClick} className="cursor-pointer">
                <DropdownMenu.Shortcut className="ml-0" />
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  onQuoteReply?.()
                }}
                className="cursor-pointer"
              >
                <DropdownMenu.Shortcut className="ml-0" />
                Quote reply
              </DropdownMenu.Item>
              <DropdownMenu.Item className="cursor-pointer" onClick={() => onCopyClick?.(commentId, isNotCodeComment)}>
                <DropdownMenu.Shortcut className="ml-0" />
                Copy Link
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                className="cursor-pointer text-destructive"
                onClick={ev => {
                  ev.stopPropagation()
                  handleDeleteComment?.()
                }}
              >
                <DropdownMenu.Shortcut className="ml-0">
                  <Icon name="trash" className="mr-2 text-destructive" />
                </DropdownMenu.Shortcut>
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      )
    }
    return (
      <div className="inline-flex w-full items-center justify-between gap-1.5">
        <div className="inline-flex items-center gap-1.5">
          {avatar && <div>{avatar}</div>}
          {name && <span className="text-14 font-medium text-foreground-8">{name}</span>}
          {description && <span className="text-14 text-foreground-4">{description}</span>}
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

const PullRequestTimelineItem: FC<TimelineItemProps> = ({
  header,
  contentHeader,
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
  isNotCodeComment,
  data,
  handleUpload,
  onQuoteReply,
  quoteReplyText
}) => {
  const [comment, setComment] = useState('')
  const [isExpanded, setIsExpanded] = useState(!isResolved)

  useEffect(() => {
    if (quoteReplyText) setComment(quoteReplyText)
  }, [quoteReplyText])

  useEffect(() => {
    if (isResolved) {
      setIsExpanded(false)
    }
  }, [isResolved])

  const renderContent = () => {
    if (!content) return null

    // Show full content if not resolved or expanded
    if (!isResolved || isExpanded) {
      return content
    }

    // For resolved comments with contentHeader, hide all content when collapsed
    if (contentHeader) {
      return null
    }

    // For resolved comments without contentHeader, show only the first comment
    const contentElement = content as ReactElement
    if (contentElement.props?.children?.length) {
      // If content is an array of comments, take the first one
      const [firstComment] = Children.toArray(contentElement.props.children)
      return <div className="px-4 pt-4 [&_[data-connector]]:hidden">{firstComment}</div>
    }
    // If content is a single element, return as is
    return content
  }

  return (
    <div id={id}>
      <NodeGroup.Root>
        {icon && <NodeGroup.Icon className={cn({ 'border-transparent': hideIconBorder })}>{icon}</NodeGroup.Icon>}
        <NodeGroup.Title className={titleClassName}>
          {/* Ensure that header has at least one item */}
          {header.length > 0 && (
            <div className="flex w-full items-center justify-between gap-x-2">
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
              {isResolved && !contentHeader && (
                <Button
                  className="h-auto gap-x-1.5 px-4 font-normal text-foreground-2 hover:text-foreground-8"
                  variant="custom"
                  onClick={() => setIsExpanded(prev => !prev)}
                >
                  <Icon name={isExpanded ? 'collapse-comment' : 'expand-comment'} size={14} />
                  {isExpanded ? 'Hide resolved' : 'Show resolved'}
                </Button>
              )}
            </div>
          )}
        </NodeGroup.Title>
        {content && (
          <NodeGroup.Content>
            <Card.Root className={cn('rounded-md bg-transparent overflow-hidden shadow-none', contentClassName)}>
              {contentHeader && (
                <div
                  className={cn('flex w-full items-center justify-between p-4 bg-background-2', {
                    'pr-1.5': isResolved
                  })}
                >
                  {contentHeader}
                  {isResolved && (
                    <Button
                      className="h-auto gap-x-1.5 px-2.5 font-normal text-foreground-2 hover:text-foreground-8"
                      variant="custom"
                      onClick={() => setIsExpanded(prev => !prev)}
                    >
                      <Icon name={isExpanded ? 'collapse-comment' : 'expand-comment'} size={14} />
                      {isExpanded ? 'Hide resolved' : 'Show resolved'}
                    </Button>
                  )}
                </div>
              )}

              {isEditMode ? (
                <PullRequestCommentBox
                  handleUpload={handleUpload}
                  isEditMode
                  currentUser={currentUser}
                  onSaveComment={() => {
                    handleSaveComment?.(comment, parentCommentId)
                    setComment('')
                  }}
                  onCancelClick={() => {
                    setComment('')
                  }}
                  comment={comment}
                  setComment={setComment}
                />
              ) : (
                renderContent()
              )}
              {!hideReplySection && (!isResolved || isExpanded) && (
                <>
                  {hideReplyHere ? (
                    <PullRequestCommentBox
                      handleUpload={handleUpload}
                      inReplyMode
                      onSaveComment={() => {
                        handleSaveComment?.(comment, parentCommentId)
                        setHideReplyHere?.(false)
                      }}
                      onCancelClick={() => {
                        setHideReplyHere?.(false)
                      }}
                      comment={comment}
                      setComment={setComment}
                    />
                  ) : (
                    <div className={cn('flex items-center gap-3 border-t bg-background-2', replyBoxClassName)}>
                      {currentUser ? (
                        <Avatar className="size-6 rounded-full p-0">
                          <AvatarFallback>
                            <span className="text-12 text-foreground-3">{getInitials(currentUser ?? '', 2)}</span>
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
                  )}
                  <div className={cn('flex gap-3 border-t', replyBoxClassName)}>
                    <Button
                      variant="outline"
                      onClick={() => {
                        toggleConversationStatus?.(isResolved ? 'active' : 'resolved', parentCommentId)
                      }}
                    >
                      {isResolved ? 'Unresolve conversation' : 'Resolve conversation'}
                    </Button>
                  </div>
                </>
              )}
            </Card.Root>
          </NodeGroup.Content>
        )}
        {!isLast && <NodeGroup.Connector />}
      </NodeGroup.Root>
    </div>
  )
}

export default PullRequestTimelineItem
