import { useCallback, useEffect } from 'react'

import { CodeCommentState } from '../details/pull-request-details-types'

export const PR_COMMENT_STATUS_CHANGED_EVENT = 'PR_COMMENT_STATUS_CHANGED_EVENT'
export const PULL_REQUEST_ALL_COMMENTS_ID = Number.MIN_SAFE_INTEGER
interface CustomEventDetail {
  id: number
  status: CodeCommentState
}
interface UseEmitCodeCommentStatusProps {
  id?: number
  onMatch: (status: CodeCommentState, id: number) => void
}

export function useEmitCodeCommentStatus({ id, onMatch }: UseEmitCodeCommentStatusProps) {
  const callback = useCallback(
    (event: CustomEvent) => {
      if ((id && event.detail.id === id) || id === PULL_REQUEST_ALL_COMMENTS_ID) {
        onMatch(event.detail.status, event.detail.id)
      }
    },
    [id, onMatch]
  )
  const emitCodeCommentStatus = useCallback(
    (status: CodeCommentState) => {
      const event = new CustomEvent(PR_COMMENT_STATUS_CHANGED_EVENT, { detail: { id, status } })
      document.dispatchEvent(event)
    },
    [id]
  )
  useEffect(() => {
    const eventListener = (event: CustomEvent<CustomEventDetail>) => {
      if ((id && event.detail.id === id) || id === PULL_REQUEST_ALL_COMMENTS_ID) {
        onMatch(event.detail.status, event.detail.id)
      }
    }

    document.addEventListener(PR_COMMENT_STATUS_CHANGED_EVENT, eventListener as EventListener)

    return () => {
      document.removeEventListener(PR_COMMENT_STATUS_CHANGED_EVENT, eventListener as EventListener)
    }
  }, [callback, id, onMatch])
  return emitCodeCommentStatus
}
