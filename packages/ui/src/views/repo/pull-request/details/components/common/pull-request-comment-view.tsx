// SuggestionCommentContent.tsx

import React from 'react'

import { Button, MarkdownViewer } from '@components/index'
import { CommitSuggestion } from '@views/repo/pull-request/pull-request.types'
import { get } from 'lodash-es'

import { CommentItem, TypesPullReqActivity } from '../../pull-request-details-types'
import { activitiesToDiffCommentItems } from '../../pull-request-utils'

interface PRCommentViewProps {
  commentItem: CommentItem<TypesPullReqActivity>
  filenameToLanguage?: (fileName: string) => string | undefined
  suggestionsBatch?: CommitSuggestion[]
  onCommitSuggestion?: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch?: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch?: (commentId: number) => void
}

const PRCommentView: React.FC<PRCommentViewProps> = ({
  commentItem,
  filenameToLanguage,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch
}) => {
  const pathSegments = commentItem?.payload?.code_comment?.path?.split('/') || []
  const fileLang = filenameToLanguage?.(pathSegments.pop() || '') || ''

  const appliedCheckSum = get(commentItem, 'payload.metadata.suggestions.applied_check_sum', '')
  const checkSums = get(commentItem, 'payload.metadata.suggestions.check_sums', []) as string[]
  const isSuggestion = !!checkSums.length
  const isApplied = appliedCheckSum === checkSums?.[0]
  const isInBatch = suggestionsBatch?.some(suggestion => suggestion.comment_id === commentItem.id)
  const diffCommentItem = activitiesToDiffCommentItems(commentItem)

  return (
    <>
      <MarkdownViewer
        source={commentItem?.payload?.payload?.text || ''}
        suggestionBlock={{
          source: diffCommentItem.codeBlockContent || '',
          lang: fileLang,
          commentId: commentItem.id,
          appliedCheckSum: appliedCheckSum,
          appliedCommitSha: get(commentItem, 'payload.metadata.suggestions.applied_commit_sha', '')
        }}
        suggestionCheckSum={checkSums?.[0] || ''}
        isSuggestion={isSuggestion}
      />

      {/* Only show the suggestion buttons if the suggestion is not yet applied */}
      {isSuggestion && !isApplied && (
        <div className="flex gap-3">
          {isInBatch ? (
            <Button variant="outline" theme="warning" onClick={() => removeSuggestionFromBatch?.(commentItem.id)}>
              Remove suggestion from batch
            </Button>
          ) : (
            <>
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

              <Button
                variant="outline"
                onClick={() => {
                  onCommitSuggestion?.({
                    check_sum: checkSums?.[0] || '',
                    comment_id: commentItem.id
                  })
                }}
              >
                Commit suggestion
              </Button>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default PRCommentView
