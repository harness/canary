import { useCallback, useState } from 'react'

import {
  commentCreatePullReq,
  commentDeletePullReq,
  commentUpdatePullReq,
  ListPullReqActivitiesOkResponse,
  TypesPullReqActivity
} from '@harnessio/code-service-client'
import { CommitSuggestion } from '@harnessio/ui/views'
import { generateAlphaNumericHash } from '@harnessio/views'

interface usePRCommonInteractionsProps {
  repoRef: string
  prId: number
  refetchActivities: () => void
  updateCommentStatus: (repoRef: string, prId: number, commentId: number, status: string, done: () => void) => void
  currentUserName?: string
  setActivities?: React.Dispatch<React.SetStateAction<ListPullReqActivitiesOkResponse | undefined>>
}

export function usePRCommonInteractions({
  repoRef,
  prId,
  refetchActivities,
  updateCommentStatus,
  currentUserName,
  setActivities
}: usePRCommonInteractionsProps) {
  let count = generateAlphaNumericHash(5)

  const handleSaveComment = useCallback(
    async (text: string, parentId?: number) => {
      // Optionally replicate ephemeral logic from conversation page:
      const newComment: TypesPullReqActivity = {
        id: parentId ?? 0, // Temporary ID or fallback
        author: { display_name: currentUserName ?? '' },
        created: Date.now(),
        edited: Date.now(),
        updated: Date.now(),
        deleted: 0,
        code_comment: undefined,
        text,
        payload: {
          message: text,
          parent_id: parentId,
          author: { display_name: currentUserName ?? '' },
          id: count, // ephemeral ID
          created: Date.now(),
          edited: Date.now(),
          updated: Date.now(),
          deleted: 0,
          code_comment: undefined,
          text
        }
      }

      count += 1 // increment ephemeral ID

      if (setActivities) {
        setActivities(prev => {
          if (!prev) return prev
          return [...prev, newComment]
        })
      }

      // Persist the new comment
      return commentCreatePullReq({
        repo_ref: repoRef,
        pullreq_number: prId,
        body: { text, parent_id: parentId }
      })
        .then(() => {
          refetchActivities()
        })
        .catch(error => {
          if (setActivities) {
            setActivities(prev => prev?.filter(item => item.id !== newComment.id))
          }
          console.error('Failed to create comment:', error)
        })
    },
    [repoRef, prId, refetchActivities, setActivities, currentUserName]
  )

  const updateComment = useCallback(
    async (commentId: number, text: string) => {
      return commentUpdatePullReq({
        repo_ref: repoRef,
        pullreq_number: prId,
        pullreq_comment_id: commentId,
        body: { text }
      })
        .then(() => refetchActivities())
        .catch(error => {
          console.error('Failed to update comment:', error)
        })
    },
    [repoRef, prId, refetchActivities]
  )

  const deleteComment = useCallback(
    async (commentId: number) => {
      return commentDeletePullReq({
        repo_ref: repoRef,
        pullreq_number: prId,
        pullreq_comment_id: commentId
      })
        .then(() => {
          refetchActivities()
        })
        .catch(error => {
          console.error('Failed to delete comment:', error)
        })
    },
    [repoRef, prId, refetchActivities]
  )

  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false)
  const [suggestionsBatch, setSuggestionsBatch] = useState<CommitSuggestion[]>([])
  const [suggestionToCommit, setSuggestionToCommit] = useState<CommitSuggestion>()

  const onCommitSuggestion = useCallback((suggestion: CommitSuggestion) => {
    setSuggestionToCommit(suggestion)
    setIsCommitDialogOpen(true)
  }, [])

  const onCommitSuggestionSuccess = useCallback(() => {
    setIsCommitDialogOpen(false)
    setSuggestionsBatch([])
    refetchActivities()
  }, [refetchActivities])

  const addSuggestionToBatch = useCallback((suggestion: CommitSuggestion) => {
    setSuggestionsBatch(prev => [...prev, suggestion])
  }, [])

  const removeSuggestionFromBatch = useCallback((commentId: number) => {
    setSuggestionsBatch(prev => prev.filter(s => s.comment_id !== commentId))
  }, [])

  const onCommitSuggestionsBatch = () => setIsCommitDialogOpen(true)

  const onCommentSaveAndStatusChange = useCallback(
    async (commentText: string, status: string, parentId?: number) => {
      await handleSaveComment(commentText, parentId)
      if (parentId) {
        updateCommentStatus(repoRef, prId, parentId, status, refetchActivities)
      }
    },
    [handleSaveComment, updateCommentStatus, refetchActivities, prId, repoRef]
  )

  const toggleConversationStatus = useCallback(
    (status: string, parentId?: number) => {
      if (parentId && updateCommentStatus) {
        updateCommentStatus(repoRef, prId, parentId, status, refetchActivities)
      }
    },
    [updateCommentStatus, prId, repoRef, refetchActivities]
  )

  return {
    handleSaveComment,
    updateComment,
    deleteComment,

    // suggestions
    isCommitDialogOpen,
    setIsCommitDialogOpen,
    suggestionsBatch,
    suggestionToCommit,
    onCommitSuggestion,
    onCommitSuggestionsBatch,
    onCommitSuggestionSuccess,
    addSuggestionToBatch,
    removeSuggestionFromBatch,

    // comment status
    onCommentSaveAndStatusChange,
    toggleConversationStatus
  }
}
