import { useCallback, useMemo, useRef, useState } from 'react'

import { commentCreatePullReq, commentDeletePullReq, commentUpdatePullReq } from '@harnessio/code-service-client'
import { generateAlphaNumericHash } from '@harnessio/ui/utils'
import { CommitSuggestion } from '@harnessio/ui/views'

import { useAPIPath } from '../../../hooks/useAPIPath'
import { getErrorMessage } from '../pull-request-utils'

interface usePRCommonInteractionsProps {
  repoRef: string
  prId: number
  refetchActivities: () => void
  updateCommentStatus: (repoRef: string, prId: number, commentId: number, status: string, done: () => void) => void
  dryMerge?: () => void
}

export function usePRCommonInteractions({
  repoRef,
  prId,
  refetchActivities,
  updateCommentStatus,
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
        const apiPathUrl = apiPath(`${uploadsURL}/${filePath}`)
        return `${window.location.origin}${apiPathUrl}`
      } catch (exception) {
        console.warn(getErrorMessage(exception))
        return ''
      }
    },
    [uploadsURL, apiPath]
  )

  const handleUpload = useCallback(
    (blob: File, setMarkdownContent: (data: string) => void, currentComment?: string) => {
      const reader = new FileReader()

      // Set up a function to be called when the load event is triggered
      const handleLoad = async function () {
        if (blob.type.startsWith('image/') || blob.type.startsWith('video/')) {
          const markdown = await uploadImage(reader.result)

          if (blob.type.startsWith('image/')) {
            setMarkdownContent(`${currentComment} \n ![image](${markdown})`) // Set the markdown content
          } else {
            setMarkdownContent(`${currentComment} \n ${markdown}`) // Set the markdown content
          }
        }

        // Clean up event handlers after processing
        reader.onload = null
        reader.onerror = null
        reader.onabort = null
      }

      const handleError = function () {
        console.error('FileReader error occurred')
        // Clean up event handlers on error
        reader.onload = null
        reader.onerror = null
        reader.onabort = null
      }

      const handleAbort = function () {
        console.log('FileReader operation was aborted')
        // Clean up event handlers on abort
        reader.onload = null
        reader.onerror = null
        reader.onabort = null
      }

      reader.onload = handleLoad
      reader.onerror = handleError
      reader.onabort = handleAbort

      reader.readAsArrayBuffer(blob) // This will trigger the onload function when the reading is complete
    },
    [uploadImage]
  )

  const handleSaveComment = useCallback(
    async (text: string, parentId?: number) => {
      count.current += 1 // increment ephemeral ID

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
          console.warn('Failed to create comment:', error)
          throw error
        })
    },
    [repoRef, prId, refetchActivities]
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
          console.warn('Failed to update comment:', error)
          throw error
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
          console.warn('Failed to delete comment:', error)
          throw error
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
