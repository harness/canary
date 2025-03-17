import { useCallback, useMemo, useRef, useState } from 'react'

import {
  commentCreatePullReq,
  commentDeletePullReq,
  commentUpdatePullReq,
  ListPullReqActivitiesOkResponse,
  // repoArtifactUpload,
  TypesPullReqActivity
} from '@harnessio/code-service-client'
import { generateAlphaNumericHash } from '@harnessio/ui/utils'
import { CommitSuggestion } from '@harnessio/ui/views'

import { useAPIPath } from '../../../hooks/useAPIPath'
import { getErrorMessage } from '../pull-request-utils'

interface usePRCommonInteractionsProps {
  repoRef: string
  prId: number
  refetchActivities: () => void
  updateCommentStatus: (repoRef: string, prId: number, commentId: number, status: string, done: () => void) => void
  currentUserName?: string
  setActivities?: React.Dispatch<React.SetStateAction<ListPullReqActivitiesOkResponse | undefined>>
  dryMerge?: () => void
}

export function usePRCommonInteractions({
  repoRef,
  prId,
  refetchActivities,
  updateCommentStatus,
  currentUserName,
  setActivities,
  dryMerge
}: usePRCommonInteractionsProps) {
  const apiPath = useAPIPath()
  const count = useRef(generateAlphaNumericHash(5))
  const uploadsURL = useMemo(() => `/api/v1/repos/${repoRef}/uploads`, [repoRef])

  const uploadImage = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fileBlob: any
    ) => {
      try {
        const response = await fetch(apiPath(uploadsURL), {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'content-type': 'application/octet-stream'
          },
          body: fileBlob,
          redirect: 'follow'
        })
        // const response = await repoArtifactUpload({
        //   method: 'POST',
        //   headers: { 'content-type': 'application/octet-stream' },
        //   body: fileBlob,
        //   redirect: 'follow',
        //   repo_ref: repoRef
        // })

        const result = await response.json()
        if (!response.ok && result) {
          // TODO: fix error state
          console.warn(getErrorMessage(result))
          return ''
        }
        const filePath = result.file_path
        return apiPath(`${uploadsURL}/${filePath}`)
      } catch (exception) {
        console.warn(getErrorMessage(exception))
        return ''
      }
    },
    [uploadsURL, apiPath]
  )

  const handleUpload = useCallback(
    (blob: File, setMarkdownContent: (data: string) => void) => {
      const reader = new FileReader()

      // Set up a function to be called when the load event is triggered
      reader.onload = async function () {
        if (blob.type.startsWith('image/') || blob.type.startsWith('video/')) {
          const markdown = await uploadImage(reader.result)

          if (blob.type.startsWith('image/')) {
            setMarkdownContent(`![image](${markdown})`) // Set the markdown content
          } else {
            setMarkdownContent(markdown) // Set the markdown content
          }
        }
      }

      reader.readAsArrayBuffer(blob) // This will trigger the onload function when the reading is complete
    },
    [uploadImage]
  )

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
          id: count.current, // ephemeral ID
          created: Date.now(),
          edited: Date.now(),
          updated: Date.now(),
          deleted: 0,
          code_comment: undefined,
          text
        }
      }

      count.current += 1 // increment ephemeral ID

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

  const onCommitSuggestionsBatch = useCallback(() => setIsCommitDialogOpen(true), [])

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
      if (!parentId) return

      updateCommentStatus(repoRef, prId, parentId, status, refetchActivities)
      dryMerge?.()
    },
    [updateCommentStatus, prId, repoRef, refetchActivities, dryMerge]
  )

  return {
    handleUpload,
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
