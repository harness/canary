import { FC } from 'react'

import { Button, ButtonLayout, CounterBadge, Dialog, MarkdownViewer } from '@/components'
import { useTranslation } from '@/context'
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
  const { t } = useTranslation()
  const pathSegments = commentItem?.payload?.code_comment?.path?.split('/') || []
  const fileLang = filenameToLanguage?.(pathSegments.pop() || '') || ''

  const appliedCheckSum = commentItem?.payload?.metadata?.suggestions?.applied_check_sum ?? ''
  const checkSums = commentItem?.payload?.metadata?.suggestions?.check_sums ?? []
  const isApplied = appliedCheckSum === checkSums?.[0]
  const isInBatch = suggestionsBatch?.some(suggestion => suggestion.comment_id === commentItem.id)
  const suggestionCheckSum = checkSums?.[0] || ''

  const formattedComment = replaceMentionIdWithDisplayName(
    commentItem?.payload?.text || '',
    commentItem?.payload?.mentions || {}
  )

  return (
    <MarkdownViewer
      markdownClassName="pr-section"
      source={formattedComment || ''}
      suggestionBlock={{
        source:
          commentItem.codeBlockContent ??
          (parentItem && parentItem.codeBlockContent ? parentItem.codeBlockContent : ''),
        lang: fileLang
      }}
      suggestionCheckSum={suggestionCheckSum}
      suggestionTitle={
        appliedCheckSum && appliedCheckSum === suggestionCheckSum
          ? t('views:pullRequests.comments.suggestionApplied', 'Suggestion applied')
          : t('views:pullRequests.comments.codeSuggestion', 'Code suggestion')
      }
      suggestionFooter={
        !isApplied && (
          <ButtonLayout className="flex-wrap">
            <Dialog.Trigger
              className="gap-x-2"
              variant="outline"
              onClick={() => {
                onCommitSuggestion?.({
                  check_sum: suggestionCheckSum,
                  comment_id: commentItem.id
                })
              }}
            >
              {t('views:pullRequests.comments.commitSuggestion', 'Commit suggestion')}
              {!!suggestionsBatch?.length && <CounterBadge theme="info">{suggestionsBatch.length}</CounterBadge>}
            </Dialog.Trigger>
            {isInBatch ? (
              <Button variant="outline" theme="danger" onClick={() => removeSuggestionFromBatch?.(commentItem.id)}>
                {t('views:pullRequests.comments.removeSuggestion', 'Remove suggestion from batch')}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() =>
                  addSuggestionToBatch?.({
                    check_sum: suggestionCheckSum,
                    comment_id: commentItem.id
                  })
                }
              >
                {t('views:pullRequests.comments.addSuggestion', 'Add suggestion to batch')}
              </Button>
            )}
          </ButtonLayout>
        )
      }
    />
  )
}

PRCommentView.displayName = 'PRCommentView'
export default PRCommentView
