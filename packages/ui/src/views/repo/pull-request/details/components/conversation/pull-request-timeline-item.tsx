import { Children, FC, memo, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react'

import {
  Avatar,
  Button,
  DeleteAlertDialog,
  IconV2,
  IconV2NamesType,
  Layout,
  MoreActionsTooltip,
  NodeGroup,
  Text,
  TextInput
} from '@/components'
import {
  HandleUploadType,
  PrincipalPropsType,
  PrincipalsMentionMap,
  PullRequestCommentBox,
  TypesPullReqActivity
} from '@/views'
import { cn } from '@utils/cn'
import { isEmpty } from 'lodash-es'

import { replaceEmailAsKey, replaceMentionEmailWithId } from './utils'

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
  isReply?: boolean
  isResolved?: boolean
}

const ItemHeader: FC<ItemHeaderProps> = memo(
  ({
    onEditClick,
    onCopyClick,
    commentId,
    avatar,
    name,
    description = null,
    selectStatus,
    isComment,
    handleDeleteComment,
    isDeleted = false,
    isNotCodeComment = false,
    onQuoteReply,
    hideEditDelete,
    isReply = false,
    isResolved = false
  }) => {
    const actions: Array<{
      title: string
      onClick: () => void
      isDanger?: boolean
      iconName: IconV2NamesType
    }> = [
      ...(!hideEditDelete
        ? [
            {
              title: 'Edit',
              onClick: () => onEditClick?.(),
              iconName: 'edit-pencil' as const
            }
          ]
        : []),
      {
        title: 'Quote reply',
        onClick: () => onQuoteReply?.(),
        iconName: 'quote' as const
      },
      {
        title: `Copy link to ${isReply ? 'reply' : 'comment'}`,
        onClick: () => onCopyClick?.(commentId, isNotCodeComment),
        iconName: 'copy' as const
      },
      ...(!hideEditDelete
        ? [
            {
              title: `Delete ${isReply ? 'reply' : 'comment'}`,
              onClick: () => handleDeleteComment?.(),
              isDanger: true,
              iconName: 'trash' as const
            }
          ]
        : [])
    ]

    return (
      <Layout.Horizontal className="flex-1" justify="between">
        <Layout.Horizontal className="flex-1" gap="2xs" align="center" wrap="wrap">
          {/**
           * ============
           * Avatar and Name
           * ============
           */}

          {!!avatar && <div className="mr-0.5">{avatar}</div>}
          {!!name && (
            <Text variant="body-single-line-normal" color="foreground-1">
              {name}
            </Text>
          )}

          {/**
           * ============
           * Description
           * ============
           */}
          {description}

          <Text variant="body-single-line-normal" color="foreground-3">
            {selectStatus}
          </Text>
        </Layout.Horizontal>
        {isComment && !isDeleted && !isResolved && (
          <MoreActionsTooltip
            className="w-[200px]"
            iconName="more-horizontal"
            sideOffset={-8}
            alignOffset={2}
            actions={actions}
          />
        )}
      </Layout.Horizontal>
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
  principalProps: PrincipalPropsType
  principalsMentionMap: PrincipalsMentionMap
  setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  mentions?: PrincipalsMentionMap
  isDeletingComment?: boolean
  isReply?: boolean
  payload?: TypesPullReqActivity
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
  isReply,
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
  hideEditDelete,
  principalProps,
  principalsMentionMap,
  setPrincipalsMentionMap,
  mentions,
  isDeletingComment,
  payload
}) => {
  const [comment, setComment] = useState('')
  const [isExpanded, setIsExpanded] = useState(!isResolved)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (!isEmpty(mentions)) {
      const updatedMentions = replaceEmailAsKey(mentions)
      setPrincipalsMentionMap(prev => ({ ...prev, ...updatedMentions }))
    }
  }, [mentions, setPrincipalsMentionMap])

  useEffect(() => {
    if (quoteReplyText) setComment(quoteReplyText)
  }, [quoteReplyText])

  useEffect(() => {
    if (isResolved) {
      setIsExpanded(false)
    }
  }, [isResolved])

  const handleOpenDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(true)
  }, [])

  const handleConfirmDeleteComment = () => {
    setIsDeleteDialogOpen(false)
    handleDeleteComment?.()
  }

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
    <>
      <div id={id}>
        <NodeGroup.Root
          className={cn(
            {
              'pb-8': !isLast,
              'pb-4': isLast
            },
            wrapperClassName
          )}
        >
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
                  isReply={isReply}
                  isNotCodeComment={isNotCodeComment}
                  handleDeleteComment={handleOpenDeleteDialog}
                  commentId={commentId}
                  isResolved={isResolved}
                  {...header[0]}
                  onQuoteReply={() => {
                    setHideReplyHere?.(true)
                    if (parentCommentId) onQuoteReply?.(parentCommentId, data ?? '')
                  }}
                  hideEditDelete={hideEditDelete}
                />
                {isResolved && !isComment && !contentHeader && (
                  <Button variant="transparent" onClick={() => setIsExpanded(prev => !prev)}>
                    <IconV2 name={isExpanded ? 'collapse-code' : 'expand-code'} size="xs" />
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
                  <Layout.Horizontal align="center" justify="between" className={cn('p-2 px-4 bg-cn-background-2')}>
                    {contentHeader}
                    {isResolved && (
                      <Button variant="transparent" onClick={() => setIsExpanded(prev => !prev)}>
                        <IconV2 name={isExpanded ? 'collapse-code' : 'expand-code'} size="xs" />
                        {isExpanded ? 'Hide resolved' : 'Show resolved'}
                      </Button>
                    )}
                  </Layout.Horizontal>
                )}

                {isEditMode ? (
                  <PullRequestCommentBox
                    principalsMentionMap={principalsMentionMap}
                    setPrincipalsMentionMap={setPrincipalsMentionMap}
                    principalProps={principalProps}
                    handleUpload={handleUpload}
                    isEditMode
                    currentUser={currentUser}
                    onSaveComment={() => {
                      handleSaveComment?.(replaceMentionEmailWithId(comment, principalsMentionMap), parentCommentId)
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
                        principalsMentionMap={principalsMentionMap}
                        setPrincipalsMentionMap={setPrincipalsMentionMap}
                        principalProps={principalProps}
                        handleUpload={handleUpload}
                        inReplyMode
                        onSaveComment={() => {
                          handleSaveComment?.(replaceMentionEmailWithId(comment, principalsMentionMap), parentCommentId)
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
                        <TextInput
                          wrapperClassName="flex-1"
                          placeholder="Reply here"
                          onClick={() => setHideReplyHere?.(true)}
                          onChange={e => setComment(e.target.value)}
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
                        <Text variant="body-normal" color="foreground-3">
                          {/* TODO: need to identify the author who resolved the conversation */}
                          <Text as="span" variant="body-strong" color="foreground-1">
                            {payload?.resolver?.display_name}
                          </Text>
                          &nbsp; marked this conversation as resolved.
                        </Text>
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

      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        deleteFn={handleConfirmDeleteComment}
        error={null}
        message={`This will permanently delete this ${isReply ? 'reply' : 'comment'}.`}
        type={isReply ? 'reply' : 'comment'}
        identifier={String(commentId) ?? undefined}
        isLoading={isDeletingComment}
      />
    </>
  )
}

PullRequestTimelineItem.displayName = 'PullRequestTimelineItem'
export default PullRequestTimelineItem
