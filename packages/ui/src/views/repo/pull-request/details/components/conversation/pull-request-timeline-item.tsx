import { Children, FC, memo, ReactElement, ReactNode, useEffect, useState } from 'react'

import { Avatar, Button, Icon, Input, MoreActionsTooltip, NodeGroup } from '@/components'
import { HandleUploadType, PullRequestCommentBox } from '@/views'
import { cn } from '@utils/cn'

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
  hideEditDelete?: boolean
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
    onQuoteReply,
    hideEditDelete
  }) => {
    const actions = [
      ...(!hideEditDelete
        ? [
            {
              title: 'Edit',
              onClick: () => onEditClick?.()
            }
          ]
        : []),
      {
        title: 'Quote reply',
        onClick: () => onQuoteReply?.()
      },
      {
        title: 'Copy link to comment',
        onClick: () => onCopyClick?.(commentId, isNotCodeComment)
      },
      ...(!hideEditDelete
        ? [
            {
              title: 'Delete comment',
              onClick: () => handleDeleteComment?.(),
              isDanger: true
            }
          ]
        : [])
    ]

    return (
      <div className="inline-flex w-full items-center justify-between gap-1.5">
        <div className="inline-flex items-baseline gap-1.5">
          {!!avatar && <div className="mr-0.5">{avatar}</div>}
          {!!name && <span className="text-2 font-medium text-cn-foreground-1">{name}</span>}
          {!!description && <span className="text-2 text-cn-foreground-2">{description}</span>}
        </div>
        {!!selectStatus && <span className="justify-end text-2 text-cn-foreground-3">{selectStatus}</span>}
        {isComment && !isDeleted && (
          <MoreActionsTooltip
            className="w-[200px]"
            iconName="more-dots-fill"
            sideOffset={-8}
            alignOffset={2}
            actions={actions}
          />
        )}
      </div>
    )
  }
)
ItemHeader.displayName = 'ItemHeader'

interface TimelineItemPropsHeaderType {
  avatar?: ReactNode
  name?: string
  description?: ReactNode
  selectStatus?: ReactNode
}

export interface TimelineItemProps {
  header: TimelineItemPropsHeaderType[]
  parentCommentId?: number
  commentId?: number
  currentUser?: string
  contentHeader?: ReactNode
  content?: ReactNode
  icon?: ReactNode
  isLast?: boolean
  isComment?: boolean
  hideIconBorder?: boolean
  hideReplySection?: boolean
  contentWrapperClassName?: string
  contentClassName?: string
  replyBoxClassName?: string
  wrapperClassName?: string
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
  handleUpload?: HandleUploadType
  onQuoteReply?: (parentId: number, rawText: string) => void
  quoteReplyText?: string
  hideEditDelete?: boolean
}

const PullRequestTimelineItem: FC<TimelineItemProps> = ({
  header,
  contentHeader,
  content,
  icon,
  isLast = false,
  hideIconBorder,
  hideReplySection = false,
  contentWrapperClassName,
  contentClassName,
  replyBoxClassName,
  handleSaveComment,
  commentId,
  parentCommentId,
  wrapperClassName,
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
  quoteReplyText,
  hideEditDelete
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
    if (contentHeader) return null

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
      <NodeGroup.Root className={cn('pb-7 font-sans', wrapperClassName)}>
        {!!icon && <NodeGroup.Icon className={cn({ 'border-transparent': hideIconBorder })}>{icon}</NodeGroup.Icon>}
        <NodeGroup.Title className={titleClassName}>
          {/* Ensure that header has at least one item */}
          {!!header.length && (
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
                hideEditDelete={hideEditDelete}
              />
              {isResolved && !contentHeader && (
                <Button variant="ghost" onClick={() => setIsExpanded(prev => !prev)}>
                  <Icon name={isExpanded ? 'collapse-comment' : 'expand-comment'} size={14} />
                  {isExpanded ? 'Hide resolved' : 'Show resolved'}
                </Button>
              )}
            </div>
          )}
        </NodeGroup.Title>
        {!!content && (
          <NodeGroup.Content className={contentWrapperClassName}>
            <div className={cn('border rounded-md overflow-hidden', contentClassName)}>
              {!!contentHeader && (
                <div
                  className={cn('flex w-full items-center justify-between p-4 py-3.5 bg-cn-background-2', {
                    'pr-1.5': isResolved
                  })}
                >
                  {contentHeader}
                  {isResolved && (
                    <Button variant="ghost" onClick={() => setIsExpanded(prev => !prev)}>
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
                    <div className={cn('flex items-center gap-3 border-t bg-cn-background-2', replyBoxClassName)}>
                      {!!currentUser && <Avatar name={currentUser} rounded />}
                      <Input
                        className="bg-cn-background-2"
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
                  <div className={cn('flex items-center gap-x-4 border-t', replyBoxClassName)}>
                    <Button
                      variant="outline"
                      onClick={() => {
                        toggleConversationStatus?.(isResolved ? 'active' : 'resolved', parentCommentId)
                      }}
                    >
                      {isResolved ? 'Unresolve conversation' : 'Resolve conversation'}
                    </Button>

                    {isResolved && (
                      <span className="text-2 text-cn-foreground-2">
                        {/* TODO: need to identify the author who resolved the conversation */}
                        <span className="font-medium text-cn-foreground-1">{currentUser}</span> marked this conversation
                        as resolved.
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </NodeGroup.Content>
        )}
        {!isLast && <NodeGroup.Connector />}
      </NodeGroup.Root>
    </div>
  )
}

export default PullRequestTimelineItem
