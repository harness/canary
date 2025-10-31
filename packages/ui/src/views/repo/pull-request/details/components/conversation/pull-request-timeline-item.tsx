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
  Separator,
  Text,
  TextInput,
  TimeAgoCard
} from '@/components'
import { useCustomDialogTrigger } from '@/context'
import {
  HandleUploadType,
  PrincipalPropsType,
  PrincipalsMentionMap,
  PullRequestCommentBox,
  TypesPullReqActivity
} from '@/views'
import { cn } from '@utils/cn'
import { isEmpty } from 'lodash-es'

import { useExpandedComments } from '../../context/pull-request-comments-context'
import { replaceEmailAsKey } from './utils'

//Utility function to calculate thread spacing based on position
const getThreadSpacingClasses = (
  threadIndex?: number,
  totalThreads?: number,
  isLast?: boolean,
  isCompactLayout?: boolean
) => {
  if (threadIndex === undefined || totalThreads === undefined) {
    return {
      'pb-cn-md': !isLast,
      'pb-cn-sm': !isLast && isCompactLayout,
      'pb-cn-xs': isLast
    }
  }
  const isFirstThread = threadIndex === 0
  const isLastThread = threadIndex === totalThreads - 1
  const isSingleThread = totalThreads === 1
  return {
    'py-cn-xs': isSingleThread, // Single conversation: lines to conversation to lines
    'pt-cn-xs pb-cn-3xs': isFirstThread && !isSingleThread, // First: lines to conversation
    'pt-cn-3xs pb-cn-3xs': !isFirstThread && !isLastThread, // Middle: conversation to conversation
    'pt-cn-3xs pb-cn-xs': isLastThread && !isSingleThread // Last: conversation to lines
  }
}

interface ItemHeaderProps {
  avatar?: ReactNode
  name?: string
  isComment?: boolean
  hasActionsInHeader?: boolean
  description?: ReactNode
  timestamp?: number
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
    timestamp,
    selectStatus,
    isComment,
    handleDeleteComment,
    isDeleted = false,
    isNotCodeComment = false,
    onQuoteReply,
    hideEditDelete,
    isReply = false,
    isResolved = false,
    hasActionsInHeader = false
  }) => {
    const { triggerRef, registerTrigger } = useCustomDialogTrigger()
    const handleDeleteCommentWithTrigger = useCallback(() => {
      registerTrigger()
      handleDeleteComment?.()
    }, [handleDeleteComment, registerTrigger])

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
              onClick: handleDeleteCommentWithTrigger,
              isDanger: true,
              iconName: 'trash' as const
            }
          ]
        : [])
    ]

    return (
      <Layout.Horizontal className="flex-1" justify="between">
        <Text asChild variant="body-single-line-normal" color="foreground-3">
          <Layout.Horizontal className="flex-1" gap="2xs" align="center" wrap="nowrap">
            {/**
             * ============
             * Avatar and Name
             * ============
             */}

            {!!avatar && <div className="mr-cn-4xs">{avatar}</div>}
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
            {timestamp && (
              <>
                <Separator orientation="vertical" className="mx-cn-4xs h-cn-md" />
                <TimeAgoCard triggerClassName="shrink-0" timestamp={timestamp} />
              </>
            )}
            {selectStatus && (
              <Text variant="body-single-line-normal" color="foreground-3">
                {selectStatus}
              </Text>
            )}
          </Layout.Horizontal>
        </Text>
        {(isComment || hasActionsInHeader) && !isDeleted && !isResolved && (
          <MoreActionsTooltip
            ref={triggerRef}
            buttonSize="sm"
            iconName="more-horizontal"
            sideOffset={4}
            alignOffset={0}
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
  timestamp?: number
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
  renderFirstCommentBlock?: ReactNode
  icon?: ReactNode
  isFirstCommentAsHeader?: boolean
  hasActionsInHeader?: boolean
  isLast?: boolean
  isComment?: boolean
  hideIconBorder?: boolean
  hideReplySection?: boolean
  contentWrapperClassName?: string
  contentClassName?: string
  replyBoxClassName?: string
  footerBoxClassName?: string
  mainWrapperClassName?: string
  wrapperClassName?: string
  titleClassName?: string
  handleSaveComment?: (comment: string, parentId?: number) => Promise<void>
  onEditClick?: () => void
  onCopyClick?: (commentId?: number, isNotCodeComment?: boolean) => void
  isEditMode?: boolean
  handleDeleteComment?: () => Promise<void>
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
  isReply?: boolean
  payload?: TypesPullReqActivity
  threadIndex?: number
  totalThreads?: number
  layout?: 'compact' | 'default'
}

const PullRequestTimelineItem: FC<TimelineItemProps> = ({
  header,
  contentHeader,
  content,
  icon,
  isFirstCommentAsHeader = false,
  hasActionsInHeader = false,
  isLast = false,
  hideReplySection = false,
  contentWrapperClassName,
  contentClassName,
  replyBoxClassName,
  footerBoxClassName,
  handleSaveComment,
  commentId,
  parentCommentId,
  mainWrapperClassName,
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
  payload,
  threadIndex,
  totalThreads,
  renderFirstCommentBlock,
  layout = 'default'
}) => {
  const [comment, setComment] = useState('')
  const { isExpanded: getIsExpanded, toggleExpanded } = useExpandedComments()

  const expandedKey = parentCommentId || commentId || 0
  const isExpanded = !isResolved || getIsExpanded(expandedKey)

  const handleToggleExpanded = useCallback(() => {
    toggleExpanded(expandedKey)
  }, [expandedKey, toggleExpanded])

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeletingComment, setIsDeletingComment] = useState(false)
  const [isDeletingError, setIsDeletingError] = useState<Error | null>(null)

  useEffect(() => {
    if (!isDeleteDialogOpen) setIsDeletingError(null)
  }, [isDeleteDialogOpen])

  useEffect(() => {
    if (!isEmpty(mentions)) {
      const updatedMentions = replaceEmailAsKey(mentions)
      setPrincipalsMentionMap(prev => ({ ...prev, ...updatedMentions }))
    }
  }, [mentions, setPrincipalsMentionMap])

  useEffect(() => {
    if (quoteReplyText) setComment(quoteReplyText)
  }, [quoteReplyText])

  const handleOpenDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(true)
  }, [])

  const handleConfirmDeleteComment = () => {
    setIsDeletingComment(true)
    setIsDeletingError(null)
    handleDeleteComment?.()
      .then(() => {
        setIsDeleteDialogOpen(false)
      })
      .catch(error => {
        setIsDeletingError(error)
      })
      .finally(() => {
        setIsDeletingComment(false)
      })
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
      return <div className="[&_[data-connector]]:hidden">{firstComment}</div>
    }

    // If content is a single element, return as is
    return content
  }

  const isCompactLayout = layout === 'compact'

  const renderToggleButton = () => (
    <Button variant="transparent" onClick={handleToggleExpanded}>
      <IconV2 name={isExpanded ? 'collapse-code' : 'expand-code'} size="xs" />
      {isExpanded ? 'Hide resolved' : 'Show resolved'}
    </Button>
  )

  const renderDeleteDialog = () => (
    <DeleteAlertDialog
      open={isDeleteDialogOpen}
      onClose={() => {
        setIsDeleteDialogOpen(false)
      }}
      deleteFn={handleConfirmDeleteComment}
      error={isDeletingError}
      message={`This will permanently delete this ${isReply ? 'reply' : 'comment'}.`}
      type={isReply ? 'reply' : 'comment'}
      identifier={String(commentId)}
      isLoading={isDeletingComment}
    />
  )

  if (isFirstCommentAsHeader) {
    return (
      <>
        <div id={id} className={cn('px-cn-md py-cn-lg', { 'border-b': isExpanded })}>
          {renderContent()}
        </div>

        {renderDeleteDialog()}
      </>
    )
  }

  return (
    <>
      <div id={id} className={mainWrapperClassName}>
        <NodeGroup.Root
          className={cn(getThreadSpacingClasses(threadIndex, totalThreads, isLast, isCompactLayout), wrapperClassName)}
        >
          {!!icon && <NodeGroup.Icon wrapperClassName="self-auto size-auto">{icon}</NodeGroup.Icon>}
          <NodeGroup.Title className={titleClassName}>
            {/* Ensure that header has at least one item */}
            {!!header.length && (
              <div className="gap-x-cn-md flex w-full items-center justify-between">
                <ItemHeader
                  isDeleted={isDeleted}
                  onEditClick={onEditClick}
                  onCopyClick={onCopyClick}
                  isComment={isComment}
                  hasActionsInHeader={hasActionsInHeader}
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
                {isResolved && !isComment && (!contentHeader || isNotCodeComment) && renderToggleButton()}
              </div>
            )}
          </NodeGroup.Title>
          {!!content && (
            <NodeGroup.Content className={cn('overflow-auto', contentWrapperClassName)}>
              <div className={cn('border rounded-cn-3 overflow-hidden', contentClassName)}>
                {!!renderFirstCommentBlock && isExpanded && renderFirstCommentBlock}

                {!!contentHeader && (
                  <Layout.Horizontal
                    align="center"
                    justify="between"
                    className={cn('px-cn-md py-cn-sm bg-cn-2', { 'border-b': isExpanded })}
                  >
                    {contentHeader}
                    {isResolved && !isNotCodeComment && renderToggleButton()}
                  </Layout.Horizontal>
                )}

                {isEditMode ? (
                  <PullRequestCommentBox
                    autofocus
                    principalsMentionMap={principalsMentionMap}
                    setPrincipalsMentionMap={setPrincipalsMentionMap}
                    principalProps={principalProps}
                    handleUpload={handleUpload}
                    isEditMode
                    currentUser={currentUser}
                    onSaveComment={formattedComment => {
                      return handleSaveComment?.(formattedComment, parentCommentId).then(() => {
                        setComment('')
                      })
                    }}
                    onCancelClick={() => {
                      setComment('')
                    }}
                    comment={comment}
                    setComment={setComment}
                    layout={layout}
                  />
                ) : (
                  renderContent()
                )}

                {!hideReplySection && (!isResolved || isExpanded) && (
                  <>
                    {hideReplyHere ? (
                      <PullRequestCommentBox
                        buttonTitle="Reply"
                        isReply
                        principalsMentionMap={principalsMentionMap}
                        setPrincipalsMentionMap={setPrincipalsMentionMap}
                        principalProps={principalProps}
                        handleUpload={handleUpload}
                        inReplyMode
                        wrapperClassName={replyBoxClassName}
                        onSaveComment={formattedComment => {
                          return handleSaveComment?.(formattedComment, parentCommentId)
                            .then(() => {
                              setHideReplyHere?.(false)
                            })
                            .catch(e => {
                              throw e
                            })
                        }}
                        toggleConversationStatus={() =>
                          toggleConversationStatus?.(isResolved ? 'active' : 'resolved', parentCommentId)
                        }
                        isResolved={isResolved}
                        onCancelClick={() => {
                          setHideReplyHere?.(false)
                        }}
                        comment={comment}
                        setComment={setComment}
                        layout={layout}
                      />
                    ) : (
                      <div
                        className={cn(
                          'flex items-center gap-cn-sm border-t bg-cn-2 px-cn-md py-cn-xs',
                          { 'gap-cn-xs px-cn-sm': isCompactLayout },
                          replyBoxClassName
                        )}
                      >
                        {!!currentUser && <Avatar name={currentUser} rounded />}
                        <TextInput
                          wrapperClassName="flex-1"
                          placeholder="Reply here"
                          onFocus={() => setHideReplyHere?.(true)}
                          onClick={() => setHideReplyHere?.(true)}
                          onChange={e => setComment(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            toggleConversationStatus?.(isResolved ? 'active' : 'resolved', parentCommentId)
                          }}
                        >
                          <IconV2 name={isResolved ? 'bubble-upload' : 'chat-bubble-check'} />
                          {isResolved ? 'Unresolve' : 'Resolve'}
                        </Button>
                      </div>
                    )}
                    {isResolved && (
                      <Text
                        className={cn('border-t px-cn-md py-cn-sm text-ellipsis overflow-hidden', footerBoxClassName)}
                        align="right"
                        variant="body-normal"
                        color="foreground-3"
                      >
                        {/* TODO: need to identify the author who resolved the conversation */}
                        <Text
                          className="[overflow-wrap:break-word]"
                          as="span"
                          variant="body-strong"
                          color="foreground-1"
                        >
                          {payload?.resolver?.display_name}
                        </Text>{' '}
                        marked this conversation as resolved.
                      </Text>
                    )}
                  </>
                )}
              </div>
            </NodeGroup.Content>
          )}
          {!isLast && <NodeGroup.Connector className={cn('left-[0.8rem] top-cn-3xs bottom-[-10px]')} />}
        </NodeGroup.Root>
      </div>

      {renderDeleteDialog()}
    </>
  )
}

PullRequestTimelineItem.displayName = 'PullRequestTimelineItem'
export default PullRequestTimelineItem
