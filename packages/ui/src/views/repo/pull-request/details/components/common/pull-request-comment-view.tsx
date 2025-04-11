// SuggestionCommentContent.tsx

import { FC } from 'react'

import { Button, MarkdownViewer } from '@/components'
import { CommitSuggestion } from '@views/repo/pull-request/pull-request.types'

import { CommentItem, TypesPullReqActivity } from '../../pull-request-details-types'

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

  return (
    <>
      <MarkdownViewer
        markdownClassName="comment"
        source={commentItem?.payload?.text || ''}
        suggestionBlock={{
          source: parentItem && parentItem.payload?.code_comment?.path ? parentItem.payload.code_comment.path : '',
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
            {!!suggestionsBatch?.length && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded border border-tag-border-blue-1 bg-tag-background-blue-1 px-1 text-11 leading-normal text-tag-foreground-blue-1">
                {suggestionsBatch.length}
              </span>
            )}
          </Button>
          {isInBatch ? (
            <Button variant="destructive" onClick={() => removeSuggestionFromBatch?.(commentItem.id)}>
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

export default PRCommentView
