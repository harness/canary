// SuggestionCommentContent.tsx

import { FC } from 'react'

import { Button, CounterBadge, MarkdownViewer } from '@/components'
import { CommitSuggestion } from '@views/repo/pull-request/pull-request.types'

import { CommentItem, TypesPullReqActivity } from '../../pull-request-details-types'
import { replaceMentionIdWithDisplayName } from '../conversation/utils'

export interface PRCommentViewProps {
  parentItem?: CommentItem<TypesPullReqActivity>
  commentItem: CommentItem<TypesPullReqActivity>
  filenameToLanguage?: (fileName: string) => string | undefined
  suggestionsBatch?: CommitSuggestion[]
  onCommitSuggestion?: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch?: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch?: (commentId: number) => void
}

const PRCommentView: FC<PRCommentViewProps> = ({
  commentItem,
  filenameToLanguage,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch,
  parentItem
}) => {
  const pathSegments = commentItem?.payload?.code_comment?.path?.split('/') || []
  const fileLang = filenameToLanguage?.(pathSegments.pop() || '') || ''

  const appliedCheckSum = commentItem?.payload?.metadata?.suggestions?.applied_check_sum ?? ''
  const checkSums = commentItem?.payload?.metadata?.suggestions?.check_sums ?? []
  const isSuggestion = !!checkSums?.length
  const isApplied = appliedCheckSum === checkSums?.[0]
  const isInBatch = suggestionsBatch?.some(suggestion => suggestion.comment_id === commentItem.id)

  const formattedComment = replaceMentionIdWithDisplayName(
    commentItem?.payload?.text || '',
    commentItem?.payload?.mentions || {}
  )

  return (
    <>
      <MarkdownViewer
        markdownClassName="comment"
        source={formattedComment || ''}
        suggestionBlock={{
          source:
            commentItem.codeBlockContent ??
            (parentItem && parentItem.codeBlockContent ? parentItem.codeBlockContent : ''),
          lang: fileLang,
          commentId: commentItem.id,
          appliedCheckSum: appliedCheckSum,
          appliedCommitSha: commentItem.appliedCommitSha || ''
        }}
        suggestionCheckSum={checkSums?.[0] || ''}
        isSuggestion={isSuggestion}
      />

      {/* Only show the suggestion buttons if the suggestion is not yet applied */}
      {isSuggestion && !isApplied && (
        <div className="flex justify-end gap-x-2.5">
          <Button
            className="gap-x-2"
            variant="outline"
            onClick={() => {
              onCommitSuggestion?.({
                check_sum: checkSums?.[0] || '',
                comment_id: commentItem.id
              })
            }}
          >
            Commit suggestion
            {!!suggestionsBatch?.length && <CounterBadge theme="info">{suggestionsBatch.length}</CounterBadge>}
          </Button>
          {isInBatch ? (
            <Button variant="outline" theme="danger" onClick={() => removeSuggestionFromBatch?.(commentItem.id)}>
              Remove suggestion from batch
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() =>
                addSuggestionToBatch?.({
                  check_sum: checkSums?.[0] || '',
                  comment_id: commentItem.id
                })
              }
            >
              Add suggestion to batch
            </Button>
          )}
        </div>
      )}
    </>
  )
}

PRCommentView.displayName = 'PRCommentView'
export default PRCommentView
