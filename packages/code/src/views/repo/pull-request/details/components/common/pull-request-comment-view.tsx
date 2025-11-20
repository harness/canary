import { FC, useMemo } from 'react'

import { MarkdownViewer } from '@/components/markdown-viewer'
import { CommitSuggestion } from '@views/repo/pull-request/pull-request.types'

import { Button, ButtonLayout, CounterBadge, Dialog } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'

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
  const pathSegments = useMemo(() => commentItem?.payload?.code_comment?.path?.split('/') || [], [commentItem])
  const fileLang = useMemo(
    () => filenameToLanguage?.(pathSegments.pop() || '') || '',
    [filenameToLanguage, pathSegments]
  )
  const source = useMemo(
    () => commentItem.codeBlockContent ?? (parentItem?.codeBlockContent || ''),
    [commentItem.codeBlockContent, parentItem]
  )

  const suggestionBlock = useMemo(() => ({ source, lang: fileLang }), [fileLang, source])

  const appliedCheckSum = commentItem?.payload?.metadata?.suggestions?.applied_check_sum ?? ''
  const checkSums = commentItem?.payload?.metadata?.suggestions?.check_sums ?? []
  const isApplied = appliedCheckSum === checkSums?.[0]
  const isInBatch = suggestionsBatch?.some(suggestion => suggestion.comment_id === commentItem.id)
  const suggestionCheckSum = checkSums?.[0] || ''

  const formattedComment = replaceMentionIdWithDisplayName(
    commentItem?.payload?.text || '',
    commentItem?.payload?.mentions || {}
  )

  const suggestionFooter = useMemo(
    () => (
      <ButtonLayout className="flex-wrap">
        <Dialog.Trigger>
          <Button
            className="gap-x-cn-xs"
            variant="outline"
            onClick={() => onCommitSuggestion?.({ check_sum: suggestionCheckSum, comment_id: commentItem.id })}
          >
            {t('views:pullRequests.comments.commitSuggestion', 'Commit suggestion')}
            {!!suggestionsBatch?.length && <CounterBadge theme="info">{suggestionsBatch.length}</CounterBadge>}
          </Button>
        </Dialog.Trigger>
        {isInBatch ? (
          <Button theme="danger" onClick={() => removeSuggestionFromBatch?.(commentItem.id)}>
            {t('views:pullRequests.comments.removeSuggestion', 'Remove suggestion from batch')}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => addSuggestionToBatch?.({ check_sum: suggestionCheckSum, comment_id: commentItem.id })}
          >
            {t('views:pullRequests.comments.addSuggestion', 'Add suggestion to batch')}
          </Button>
        )}
      </ButtonLayout>
    ),
    [commentItem.id, isInBatch, suggestionCheckSum, suggestionsBatch?.length]
  )

  return (
    <MarkdownViewer
      markdownClassName="pr-section"
      source={formattedComment || ''}
      suggestionBlock={suggestionBlock}
      suggestionCheckSum={suggestionCheckSum}
      suggestionTitle={
        appliedCheckSum && appliedCheckSum === suggestionCheckSum
          ? t('views:pullRequests.comments.suggestionApplied', 'Suggestion applied')
          : t('views:pullRequests.comments.codeSuggestion', 'Code suggestion')
      }
      suggestionFooter={!isApplied && suggestionFooter}
    />
  )
}

PRCommentView.displayName = 'PRCommentView'
export default PRCommentView
