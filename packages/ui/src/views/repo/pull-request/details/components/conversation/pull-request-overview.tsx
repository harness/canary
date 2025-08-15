import { FC, useMemo } from 'react'

import {
  CommentItem,
  GeneralPayload,
  HandleUploadType,
  isCodeComment,
  isComment,
  isSystemComment,
  orderSortDate,
  PRCommentFilterType,
  PrincipalPropsType,
  TypesPullReqActivity
} from '@/views'
import { Layout } from '@components/layout'
import { PullRequestRegularAndCodeComment } from '@views/repo/pull-request/details/components/conversation/regular-and-code-comment'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'
import { orderBy } from 'lodash-es'

import PRCommentView, { PRCommentViewProps } from '../common/pull-request-comment-view'
import PullRequestDescBox from './pull-request-description-box'
import PullRequestSystemComments from './pull-request-system-comments'
import { TimelineItemProps } from './pull-request-timeline-item'

export const activityToCommentItem = (activity: TypesPullReqActivity): CommentItem<TypesPullReqActivity> => ({
  id: activity.id || 0,
  author: activity.author?.display_name as string,
  created: activity.created as number,
  edited: activity.edited as number,
  updated: activity.updated as number,
  deleted: activity.deleted as number,
  outdated: !!activity.code_comment?.outdated,
  content: (activity.text || (activity.payload as GeneralPayload)?.message) as string,
  payload: activity
})

interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
}

export interface PullRequestOverviewProps
  extends RoutingProps,
    Pick<TimelineItemProps, 'toggleConversationStatus' | 'onCopyClick' | 'handleSaveComment'>,
    Required<Omit<PRCommentViewProps, 'commentItem' | 'parentItem'>> {
  handleUpdateDescription: (title: string, description: string) => Promise<void>
  data?: TypesPullReqActivity[]
  currentUser?: { display_name?: string; uid?: string }
  handleUpdateComment: (id: number, comment: string) => Promise<void>
  handleDeleteComment: (id: number) => Promise<void>
  pullReqMetadata?: TypesPullReq
  activityFilter: { label: string; value: string }
  dateOrderSort: { label: string; value: string }
  diffData?: { text: string; addedLines?: number; deletedLines?: number; data?: string; title: string; lang: string }
  toCode?: ({ sha }: { sha: string }) => string
  handleUpload: HandleUploadType
  principalProps: PrincipalPropsType
  spaceId?: string
  repoId?: string
}

export const PullRequestOverview: FC<PullRequestOverviewProps> = ({
  spaceId,
  repoId,
  data,
  pullReqMetadata,
  activityFilter,
  dateOrderSort,
  handleSaveComment,
  currentUser,
  handleDeleteComment,
  handleUpdateComment,
  onCopyClick,
  handleUpload,
  suggestionsBatch,
  onCommitSuggestion,
  addSuggestionToBatch,
  removeSuggestionFromBatch,
  filenameToLanguage,
  toggleConversationStatus,
  handleUpdateDescription,
  toCommitDetails,
  toCode,
  principalProps
}) => {
  /**
   * Get sorted model of Data props
   */
  const mappedData: CommentItem<TypesPullReqActivity>[][] = useMemo(() => {
    if (!data) return []

    // Separate parent comments and child comments
    const parentComments = data.filter(activity => !activity.parent_id)
    const childComments = data.filter(activity => activity.parent_id)

    // Sort parent comments by the chosen order
    const sortedParentComments = orderBy(parentComments, 'created', dateOrderSort.value as orderSortDate)

    // Sort child comments always in ascending order (oldest first)
    const sortedChildComments = orderBy(childComments, 'created', orderSortDate.ASC)

    // Group comments into threads
    const threadMap = new Map<number, CommentItem<TypesPullReqActivity>[]>()

    // Add parent comments first
    sortedParentComments.forEach(activity => {
      const parentId = activity.id
      if (parentId) {
        threadMap.set(parentId, [activityToCommentItem(activity)])
      }
    })

    // Add child comments to their respective parent threads
    sortedChildComments.forEach(activity => {
      const parentId = activity.parent_id
      if (parentId && threadMap.has(parentId)) {
        threadMap.get(parentId)?.push(activityToCommentItem(activity))
      }
    })

    return Array.from(threadMap.values())
  }, [data, dateOrderSort])

  /**
   * Retrieve Data by Filter
   */
  const activityBlocks = useMemo(() => {
    switch (activityFilter.value) {
      case PRCommentFilterType.ALL_COMMENTS:
        return mappedData.filter(item => !isSystemComment(item))

      case PRCommentFilterType.RESOLVED_COMMENTS:
        return mappedData.filter(item => item[0].payload?.resolved && (isCodeComment(item) || isComment(item)))

      case PRCommentFilterType.UNRESOLVED_COMMENTS:
        return mappedData.filter(item => !item[0].payload?.resolved && (isComment(item) || isCodeComment(item)))

      case PRCommentFilterType.MY_COMMENTS:
        return mappedData.filter(
          item =>
            !isSystemComment(item) &&
            item.some(comment => currentUser?.uid && comment.payload?.author?.uid === currentUser.uid)
        )

      default:
        return mappedData
    }
  }, [mappedData, activityFilter, currentUser?.uid])

  const PRCommentViewBase = useMemo(() => {
    const Component = ({
      commentItem,
      parentItem
    }: {
      commentItem: PRCommentViewProps['commentItem']
      parentItem?: CommentItem<TypesPullReqActivity>
    }) => (
      <PRCommentView
        commentItem={commentItem}
        parentItem={parentItem}
        filenameToLanguage={filenameToLanguage}
        suggestionsBatch={suggestionsBatch}
        onCommitSuggestion={onCommitSuggestion}
        addSuggestionToBatch={addSuggestionToBatch}
        removeSuggestionFromBatch={removeSuggestionFromBatch}
      />
    )

    Component.displayName = 'PRCommentViewBase'

    return Component
  }, [filenameToLanguage, suggestionsBatch, onCommitSuggestion, addSuggestionToBatch, removeSuggestionFromBatch])

  return (
    <div className="flex flex-col">
      {/* ADD PROPER GAP */}
      <Layout.Vertical gap="none">
        {activityFilter.value === PRCommentFilterType.SHOW_EVERYTHING && (
          <PullRequestDescBox
            principalProps={principalProps}
            handleUpload={handleUpload}
            title={pullReqMetadata?.title}
            handleUpdateDescription={handleUpdateDescription}
            createdAt={pullReqMetadata?.created}
            isLast={!(activityBlocks?.length > 0)}
            author={pullReqMetadata?.author?.display_name}
            prNum={`#${pullReqMetadata?.number}`}
            description={pullReqMetadata?.description}
          />
        )}

        {activityBlocks?.map((commentItems, index) => {
          const isLast = activityBlocks.length - 1 === index
          if (isSystemComment(commentItems)) {
            return (
              <PullRequestSystemComments
                principalProps={principalProps}
                key={commentItems[0].id}
                toCommitDetails={toCommitDetails}
                commentItems={commentItems}
                isLast={isLast}
                pullReqMetadata={pullReqMetadata}
                toCode={toCode}
                spaceId={spaceId}
                repoId={repoId}
              />
            )
          }
          const parentActivity = commentItems.length > 0 ? commentItems[0] : undefined

          return (
            <PullRequestRegularAndCodeComment
              key={commentItems[0].id}
              principalProps={principalProps}
              commentItems={commentItems}
              parentItem={parentActivity}
              handleUpload={handleUpload}
              currentUser={currentUser}
              toggleConversationStatus={toggleConversationStatus}
              isLast={isLast}
              handleSaveComment={handleSaveComment}
              onCopyClick={onCopyClick}
              handleDeleteComment={handleDeleteComment}
              handleUpdateComment={handleUpdateComment}
              componentViewBase={PRCommentViewBase}
            />
          )
        })}
      </Layout.Vertical>
    </div>
  )
}

PullRequestOverview.displayName = 'PullRequestOverview'
