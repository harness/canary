import { FC, useCallback, useState } from 'react'

import { Button, DeleteAlertDialog, IconV2, NodeGroup } from '@/components'
import { HandleUploadType, PrincipalPropsType, PrincipalsMentionMap, TypesPullReqActivity } from '@/views'
import { cn } from '@utils/cn'

import { CommentContent } from './comment-content'
import { CommentAction, CommentHeader } from './comment-header'
import { CommentReplyBox } from './comment-reply-box'
import { ConversationManager } from './conversation-manager'
import { useCommentState } from './use-comment-state'
import { replaceMentionEmailWithId } from './utils'

export interface CommentData {
  id: number
  author?: string
  text?: string
  created?: string
  isDeleted?: boolean
  canEdit?: boolean
  canDelete?: boolean
  mentions?: PrincipalsMentionMap
}

export interface CommentThreadProps {
  parentComment: CommentData
  replies?: CommentData[]
  isResolved?: boolean
  resolvedBy?: string
  contentHeader?: React.ReactNode
  content?: React.ReactNode
  currentUser?: string
  onSaveComment?: (text: string, parentId?: number) => Promise<void>
  onUpdateComment?: (commentId: number, text: string) => Promise<void>
  onDeleteComment?: (commentId: number) => Promise<void>
  onCopyClick?: (commentId?: number, isNotCodeComment?: boolean) => void
  onQuoteReply?: (parentId: number, originalText: string) => void
  onToggleConversationStatus?: (status: 'resolved' | 'active', parentId?: number) => void
  quoteReplyText?: string
  handleUpload?: HandleUploadType
  principalProps: PrincipalPropsType
  principalsMentionMap: PrincipalsMentionMap
  setPrincipalsMentionMap: React.Dispatch<React.SetStateAction<PrincipalsMentionMap>>
  hideReplySection?: boolean
  showResolveSection?: boolean
  contentClassName?: string
  replyBoxClassName?: string
}

export const CommentThread: FC<CommentThreadProps> = ({
  parentComment,
  replies = [],
  isResolved = false,
  resolvedBy,
  contentHeader,
  content,
  currentUser,
  onSaveComment,
  onUpdateComment,
  onDeleteComment,
  onCopyClick,
  onQuoteReply,
  onToggleConversationStatus,
  quoteReplyText,
  handleUpload,
  principalProps,
  principalsMentionMap,
  setPrincipalsMentionMap,
  hideReplySection = false,
  showResolveSection = true,
  contentClassName,
  replyBoxClassName
}) => {
  const { state, actions } = useCommentState({
    isResolved,
    quoteReplyText
  })

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    try {
      actions.startDeleting()
      await onDeleteComment?.(parentComment.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      actions.setDeleteError(error as Error)
    } finally {
      actions.stopDeleting()
    }
  }, [onDeleteComment, parentComment.id, actions])

  const handleSaveEdit = useCallback(async () => {
    try {
      await onUpdateComment?.(parentComment.id, replaceMentionEmailWithId(state.editComment, principalsMentionMap))
      actions.exitEditMode()
    } catch (error) {
      console.error('Failed to update comment:', error)
    }
  }, [onUpdateComment, parentComment.id, state.editComment, principalsMentionMap, actions])

  const handleSaveReply = useCallback(async () => {
    try {
      await onSaveComment?.(replaceMentionEmailWithId(state.replyText, principalsMentionMap), parentComment.id)
      actions.setReplyText('')
      actions.toggleReplyBox()
    } catch (error) {
      console.error('Failed to save reply:', error)
      throw error
    }
  }, [onSaveComment, state.replyText, principalsMentionMap, parentComment.id, actions])

  const commentActions: CommentAction[] = [
    ...(parentComment.canEdit
      ? [
          {
            title: 'Edit',
            onClick: () => actions.enterEditMode(parentComment.text || ''),
            iconName: 'edit-pencil' as const
          }
        ]
      : []),
    {
      title: 'Quote reply',
      onClick: () => onQuoteReply?.(parentComment.id, parentComment.text || ''),
      iconName: 'quote' as const
    },
    {
      title: 'Copy link to comment',
      onClick: () => onCopyClick?.(parentComment.id),
      iconName: 'copy' as const
    },
    ...(parentComment.canDelete
      ? [
          {
            title: 'Delete comment',
            onClick: handleDeleteClick,
            isDanger: true,
            iconName: 'trash' as const
          }
        ]
      : [])
  ]

  const renderContent = () => {
    if (!state.isExpanded && isResolved) {
      if (contentHeader) return null
      return <div className="px-4 pt-4">{content}</div>
    }
    return content
  }

  return (
    <>
      <NodeGroup.Content className="overflow-auto">
        <div className={cn('border rounded-md overflow-hidden', contentClassName)}>
          {contentHeader && (
            <div className="p-2 px-4 bg-cn-background-2 flex items-center justify-between">
              {contentHeader}
              {isResolved && (
                <Button variant="transparent" onClick={actions.toggleExpanded}>
                  <IconV2 name={state.isExpanded ? 'collapse-code' : 'expand-code'} size="xs" />
                  {state.isExpanded ? 'Hide resolved' : 'Show resolved'}
                </Button>
              )}
            </div>
          )}

          <CommentContent
            content={renderContent()}
            isEditMode={state.editMode}
            isDeleted={parentComment.isDeleted}
            comment={state.editComment}
            setComment={actions.setEditComment}
            onSaveComment={handleSaveEdit}
            onCancelEdit={actions.exitEditMode}
            currentUser={currentUser}
            handleUpload={handleUpload}
            principalProps={principalProps}
            principalsMentionMap={principalsMentionMap}
            setPrincipalsMentionMap={setPrincipalsMentionMap}
          />

          {!hideReplySection && (!isResolved || state.isExpanded) && (
            <>
              <CommentReplyBox
                showReplyBox={state.showReplyBox}
                currentUser={currentUser}
                replyText={state.replyText}
                onReplyTextChange={actions.setReplyText}
                onSaveReply={handleSaveReply}
                onCancelReply={() => {
                  actions.toggleReplyBox()
                  actions.setReplyText('')
                }}
                onOpenReplyBox={actions.toggleReplyBox}
                handleUpload={handleUpload}
                principalProps={principalProps}
                principalsMentionMap={principalsMentionMap}
                setPrincipalsMentionMap={setPrincipalsMentionMap}
                className={replyBoxClassName}
              />

              {showResolveSection && (
                <ConversationManager
                  isResolved={isResolved}
                  canResolve={!!onToggleConversationStatus}
                  onToggleStatus={status => onToggleConversationStatus?.(status, parentComment.id)}
                  resolvedBy={resolvedBy}
                  className={replyBoxClassName}
                />
              )}
            </>
          )}
        </div>
      </NodeGroup.Content>

      <DeleteAlertDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        deleteFn={handleConfirmDelete}
        error={state.deleteError}
        message="This will permanently delete this comment."
        type="comment"
        identifier={String(parentComment.id)}
        isLoading={state.isDeleting}
      />
    </>
  )
}

CommentThread.displayName = 'CommentThread'
