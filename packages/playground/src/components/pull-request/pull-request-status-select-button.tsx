import { memo, useEffect, useMemo, useState } from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@harnessio/canary'

import { useEmitCodeCommentStatus } from './hooks/useEmitCodeCommentStatus'
import { CodeCommentState, type CommentItem, type TypesPullReq, type TypesPullReqActivity } from './interfaces'

interface CodeCommentStatusSelectProps {
  comment: { commentItems: CommentItem<TypesPullReqActivity>[] }
  pullReqMetadata: TypesPullReq | undefined
  repoId: string // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  commentStatusPullReq: any
  refetchActivities: () => void
}
interface StatusButtonProps {
  codeCommentStatus: string // Adjust type as necessary
  onChange: (value: string) => void
}

const StatusButton: React.FC<StatusButtonProps> = memo(({ codeCommentStatus, onChange }) => (
  <Select onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue className="py-2" placeholder={codeCommentStatus} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={CodeCommentState.ACTIVE}>Active</SelectItem>
      <SelectItem value={CodeCommentState.RESOLVED}>Resolved</SelectItem>
    </SelectContent>
  </Select>
))
StatusButton.displayName = 'StatusButton'

export const PullRequestStatusSelect: React.FC<CodeCommentStatusSelectProps> = ({
  repoId,
  pullReqMetadata,
  comment: { commentItems },
  commentStatusPullReq,
  refetchActivities
}) => {
  const [parentComment, setParentComment] = useState<CommentItem<TypesPullReqActivity> | undefined>(undefined)
  const [codeCommentStatus, setCodeCommentStatus] = useState<string>('Active')

  // Memoize parentComment and codeCommentStatus based on commentItems
  const { initialParentComment, initialStatus } = useMemo(() => {
    const firstComment = commentItems[0]
    const status = firstComment?.payload?.resolved ? 'Resolved' : 'Active'
    return { initialParentComment: firstComment, initialStatus: status }
  }, [commentItems])

  // Set initial state for parentComment and codeCommentStatus
  useEffect(() => {
    if (initialParentComment) {
      setParentComment(initialParentComment)
      setCodeCommentStatus(initialStatus)
    }
  }, [initialParentComment, initialStatus])

  const emitCodeCommentStatus = useEmitCodeCommentStatus({
    id: parentComment?.id,
    onMatch: status => {
      setCodeCommentStatus(status === CodeCommentState.ACTIVE ? 'Active' : 'Resolved')
    }
  })

  const handleChange = (newState: string) => {
    const status = newState.toLowerCase() as CodeCommentState
    const payload = { status }
    const id = parentComment?.id

    // Update local state
    setCodeCommentStatus(status === CodeCommentState.ACTIVE ? 'Active' : 'Resolved')

    // Call API to update status
    commentStatusPullReq({
      repo_ref: repoId,
      pullreq_number: pullReqMetadata?.number,
      pullreq_comment_id: id,
      body: payload
    })
      .then((data: CommentItem<TypesPullReqActivity>) => {
        if (!parentComment?.id) {
          setParentComment(data)
        }
        emitCodeCommentStatus(status)
        if (parentComment?.payload) {
          parentComment.payload.resolved = status === CodeCommentState.ACTIVE ? 0 : Date.now()
        }
        refetchActivities()
      })
      .catch((error: { message: string }) => {
        console.warn(error)
      })
  }

  return parentComment?.deleted ? null : <StatusButton codeCommentStatus={codeCommentStatus} onChange={handleChange} />
}
