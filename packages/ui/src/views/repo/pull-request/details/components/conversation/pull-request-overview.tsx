import { FC, useCallback, useMemo, useState } from 'react'

import { Avatar, Icon, Layout } from '@/components'
import {
  CommentItem,
  EnumPullReqActivityType,
  GeneralPayload,
  isCodeComment,
  isComment,
  isSystemComment,
  orderSortDate,
  PayloadAuthor,
  PayloadCodeComment,
  PayloadCreated,
  PRCommentFilterType,
  PullRequestCommentBox,
  removeLastPlus,
  TranslationStore,
  TypesPullReqActivity
} from '@/views'
import { DiffModeEnum } from '@git-diff-view/react'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'
import PullRequestDiffViewer from '@views/repo/pull-request/components/pull-request-diff-viewer'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { CommitSuggestion, TypesPullReq } from '@views/repo/pull-request/pull-request.types'
import { parseStartingLineIfOne, quoteTransform } from '@views/repo/pull-request/utils'
import { get, orderBy } from 'lodash-es'

import PRCommentView from '../common/pull-request-comment-view'
import PullRequestDescBox from './pull-request-description-box'
import PullRequestSystemComments from './pull-request-system-comments'
import PullRequestTimelineItem from './pull-request-timeline-item'

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

export interface PullRequestOverviewProps extends RoutingProps {
  handleUpdateDescription: (title: string, description: string) => void
  data?: TypesPullReqActivity[]
  currentUser?: { display_name?: string; uid?: string }
  handleUpdateComment: (id: number, comment: string) => void
  handleSaveComment: (comment: string, parentId?: number) => void
  useTranslationStore: () => TranslationStore
  handleDeleteComment: (id: number) => void
  handleUpload: (blob: File, setMarkdownContent: (data: string) => void) => void
  pullReqMetadata?: TypesPullReq
  activityFilter: { label: string; value: string }
  dateOrderSort: { label: string; value: string }
  diffData?: { text: string; addedLines?: number; deletedLines?: number; data?: string; title: string; lang: string }
  onCopyClick: (commentId?: number) => void
  suggestionsBatch: CommitSuggestion[]
  onCommitSuggestion: (suggestion: CommitSuggestion) => void
  addSuggestionToBatch: (suggestion: CommitSuggestion) => void
  removeSuggestionFromBatch: (commentId: number) => void
  filenameToLanguage: (fileName: string) => string | undefined
  toggleConversationStatus: (status: string, parentId?: number) => void
  toCode?: ({ sha }: { sha: string }) => string
}

const PullRequestOverview: FC<PullRequestOverviewProps> = ({
  data,
  pullReqMetadata,
  activityFilter,
  dateOrderSort,
  handleSaveComment,
  currentUser,
  handleDeleteComment,
  handleUpdateComment,
  useTranslationStore,
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
  toCode
}) => {
  const { t } = useTranslationStore()
  const {
    // mode,
    // setMode,
    highlight,
    // setHighlight,
    wrap,
    //  setWrap,
    fontsize
  } = useDiffConfig()

  const activityBlocks = useMemo(() => {
    // Each block may have one or more activities which are grouped into it. For example, one comment block
    // contains a parent comment and multiple replied comments
    const blocks: CommentItem<TypesPullReqActivity>[][] = []

    // Determine all parent activities
    const parentActivities = orderBy(
      data?.filter(activity => !activity.payload?.parent_id) || [],
      'created',
      dateOrderSort.value as orderSortDate
    ).map(_comment => [_comment])

    // Then add their children as follow-up elements (same array)
    parentActivities?.forEach(parentActivity => {
      const childActivities = data?.filter(activity => activity.payload?.parent_id === parentActivity[0].id)

      childActivities?.forEach(childComment => {
        parentActivity.push(childComment)
      })
    })

    parentActivities?.forEach(parentActivity => {
      blocks.push(parentActivity.map(activityToCommentItem))
    })
    switch (activityFilter.value) {
      case PRCommentFilterType.ALL_COMMENTS:
        return blocks?.filter(_activities => !isSystemComment(_activities))

      case PRCommentFilterType.RESOLVED_COMMENTS:
        return blocks?.filter(
          _activities => _activities[0].payload?.resolved && (isCodeComment(_activities) || isComment(_activities))
        )

      case PRCommentFilterType.UNRESOLVED_COMMENTS:
        return blocks?.filter(
          _activities => !_activities[0].payload?.resolved && (isComment(_activities) || isCodeComment(_activities))
        )

      case PRCommentFilterType.MY_COMMENTS: {
        const allCommentBlock = blocks?.filter(_activities => !isSystemComment(_activities))
        const userCommentsOnly = allCommentBlock?.filter(_activities => {
          const userCommentReply = _activities?.filter(
            authorIsUser => currentUser?.uid && authorIsUser.payload?.author?.uid === currentUser?.uid
          )
          return userCommentReply.length !== 0
        })
        return userCommentsOnly
      }
    }

    return blocks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    handleSaveComment,
    // dateOrderSort,
    activityFilter,
    currentUser?.uid
  ])

  const [editModes, setEditModes] = useState<{ [key: string]: boolean }>({})
  const [editComments, setEditComments] = useState<{ [key: string]: string }>({})
  const [hideReplyHeres, setHideReplyHeres] = useState<{ [key: string]: boolean }>({})

  const toggleEditMode = (id: string, initialText: string) => {
    setEditModes(prev => ({ ...prev, [id]: !prev[id] }))
    if (!editModes[id]) {
      setEditComments(prev => ({ ...prev, [id]: initialText }))
    }
  }

  const toggleReplyBox = (state: boolean, id?: number) => {
    if (id === undefined) {
      console.error('toggleEditMode called with undefined id')
      return
    }
    setHideReplyHeres(prev => ({ ...prev, [id]: state }))
  }

  const [quoteReplies, setQuoteReplies] = useState<Record<number, { text: string }>>({})
  const handleQuoteReply = useCallback((commentId: number, originalText: string) => {
    const quoted = quoteTransform(originalText)
    setQuoteReplies(prev => ({
      ...prev,
      [commentId]: {
        text: quoted
      }
    }))
  }, [])

  const renderedActivityBlocks = useMemo(() => {
    return (
      <div className="flex flex-col">
        <div>
          {activityFilter.value === PRCommentFilterType.SHOW_EVERYTHING && (
            <PullRequestDescBox
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
            if (isSystemComment(commentItems)) {
              return (
                <PullRequestSystemComments
                  toCommitDetails={toCommitDetails}
                  key={index}
                  commentItems={commentItems}
                  isLast={activityBlocks.length - 1 === index}
                  pullReqMetadata={pullReqMetadata}
                  toCode={toCode}
                />
              )
            } else {
              const payload = commentItems[0]?.payload // Ensure payload is typed correctly
              const parentIdAttr = `comment-${payload?.id}`

              const codeDiffSnapshot = [
                `diff --git a/src b/dest`,
                `new file mode 100644`,
                'index 0000000..0000000',
                `--- a/src/${get(payload, 'code_comment.path')}`,
                `+++ b/dest/${get(payload, 'code_comment.path')}`,
                `${get(payload, 'payload.title', '')} ttttt`,
                ...(get(payload, 'payload.lines', []) as string[])
              ].join('\n')

              if (payload?.type === ('code-comment' as EnumPullReqActivityType)) {
                const startingLine =
                  parseStartingLineIfOne(codeDiffSnapshot ?? '') !== null
                    ? parseStartingLineIfOne(codeDiffSnapshot ?? '')
                    : null

                return payload?.id ? (
                  <PullRequestTimelineItem
                    handleUpload={handleUpload}
                    data={payload?.text as string}
                    isNotCodeComment
                    id={parentIdAttr}
                    hideReplyHere={hideReplyHeres[payload?.id]}
                    setHideReplyHere={state => toggleReplyBox(state, payload?.id)}
                    quoteReplyText={quoteReplies[payload.id]?.text || ''}
                    onQuoteReply={handleQuoteReply}
                    key={payload?.id}
                    currentUser={currentUser?.display_name}
                    replyBoxClassName="p-4"
                    toggleConversationStatus={toggleConversationStatus}
                    isResolved={!!payload?.resolved}
                    icon={<Icon name="pr-review" size={12} />}
                    isLast={(data && data?.length - 1 === index) ?? false}
                    handleSaveComment={handleSaveComment}
                    parentCommentId={payload?.id}
                    header={[
                      {
                        avatar: (
                          <Avatar.Root>
                            <Avatar.Fallback>
                              {/* TODO: fix fallback string */}
                              {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                            </Avatar.Fallback>
                          </Avatar.Root>
                        ),
                        name: (payload?.author as PayloadAuthor)?.display_name,
                        // TODO: fix comment to tell between comment or code comment?
                        description: payload?.created && `reviewed ${timeAgo(payload?.created)}`
                      }
                    ]}
                    contentHeader={
                      <span className="font-medium text-foreground-1">
                        {(payload?.code_comment as PayloadCodeComment)?.path}
                      </span>
                    }
                    content={
                      <div className="flex flex-col">
                        {startingLine ? (
                          <div className="bg-[--diff-hunk-lineNumber--]">
                            <div className="ml-16 w-full px-8 py-1">{startingLine}</div>
                          </div>
                        ) : null}

                        <PullRequestDiffViewer
                          handleUpload={handleUpload}
                          data={removeLastPlus(codeDiffSnapshot)}
                          fileName={payload?.code_comment?.path ?? ''}
                          lang={(payload?.code_comment?.path && payload?.code_comment?.path.split('.').pop()) || ''}
                          fontsize={fontsize}
                          highlight={highlight}
                          mode={DiffModeEnum.Unified}
                          wrap={wrap}
                          addWidget={false}
                          useTranslationStore={useTranslationStore}
                        />
                        <div className="px-4 py-2">
                          {commentItems?.map((commentItem, idx) => {
                            const componentId = `activity-code-${commentItem?.id}`
                            const commentIdAttr = `comment-${payload?.id}`

                            return payload?.id ? (
                              <PullRequestTimelineItem
                                handleUpload={handleUpload}
                                id={commentIdAttr}
                                data={commentItem.payload?.payload?.text as string}
                                isNotCodeComment
                                hideReplySection
                                setHideReplyHere={state => toggleReplyBox(state, payload?.id)}
                                quoteReplyText={quoteReplies[payload.id]?.text || ''}
                                onQuoteReply={handleQuoteReply}
                                parentCommentId={payload?.id}
                                titleClassName="!flex max-w-full"
                                isComment
                                onCopyClick={onCopyClick}
                                commentId={commentItem.id}
                                isLast={commentItems.length - 1 === idx}
                                isDeleted={!!commentItem?.deleted}
                                handleDeleteComment={() => handleDeleteComment(commentItem?.id)}
                                onEditClick={() =>
                                  toggleEditMode(componentId, commentItem?.payload?.payload?.text || '')
                                }
                                contentClassName="border-transparent"
                                replyBoxClassName="p-4"
                                toggleConversationStatus={toggleConversationStatus}
                                icon={
                                  <Avatar.Root>
                                    <Avatar.Fallback>
                                      {/* TODO: fix fallback string */}
                                      {getInitials(
                                        (
                                          (commentItem as unknown as TypesPullReqActivity)?.payload
                                            ?.author as PayloadAuthor
                                        )?.display_name || ''
                                      )}
                                    </Avatar.Fallback>
                                  </Avatar.Root>
                                }
                                header={[
                                  {
                                    name: (
                                      (commentItem as unknown as TypesPullReqActivity)?.payload?.author as PayloadAuthor
                                    )?.display_name,
                                    // TODO: fix comment to tell between comment or code comment?
                                    description: (
                                      <Layout.Horizontal className="text-foreground-4">
                                        <span>{timeAgo((commentItem as unknown as PayloadCreated)?.created)}</span>
                                        {commentItem?.deleted ? (
                                          <>
                                            <span>&nbsp;|&nbsp;</span>
                                            <span>{t('views:pullRequests.deleted')}</span>
                                          </>
                                        ) : null}
                                      </Layout.Horizontal>
                                    )
                                  }
                                ]}
                                content={
                                  commentItem?.deleted ? (
                                    <div className="rounded-md border bg-primary-background p-1">
                                      {t('views:pullRequests.deletedComment')}
                                    </div>
                                  ) : editModes[componentId] ? (
                                    <PullRequestCommentBox
                                      isEditMode
                                      handleUpload={handleUpload}
                                      onSaveComment={() => {
                                        if (commentItem?.id) {
                                          handleUpdateComment?.(commentItem?.id, editComments[componentId])
                                          toggleEditMode(componentId, '')
                                        }
                                      }}
                                      currentUser={currentUser?.display_name}
                                      onCancelClick={() => {
                                        toggleEditMode(componentId, '')
                                      }}
                                      comment={editComments[componentId]}
                                      setComment={text => setEditComments(prev => ({ ...prev, [componentId]: text }))}
                                    />
                                  ) : (
                                    <PRCommentView
                                      commentItem={commentItem}
                                      filenameToLanguage={filenameToLanguage}
                                      suggestionsBatch={suggestionsBatch}
                                      onCommitSuggestion={onCommitSuggestion}
                                      addSuggestionToBatch={addSuggestionToBatch}
                                      removeSuggestionFromBatch={removeSuggestionFromBatch}
                                    />
                                  )
                                }
                                key={`${commentItem.id}-${commentItem.author}`}
                                hideEditDelete={payload?.author?.uid !== currentUser?.uid}
                              />
                            ) : null
                          })}
                        </div>
                      </div>
                    }
                    hideEditDelete={payload?.author?.uid !== currentUser?.uid}
                  />
                ) : null
              }

              return payload?.id ? (
                <PullRequestTimelineItem
                  handleUpload={handleUpload}
                  data={payload?.text as string}
                  id={parentIdAttr}
                  hideReplyHere={hideReplyHeres[payload?.id]}
                  setHideReplyHere={state => toggleReplyBox(state, payload?.id)}
                  quoteReplyText={quoteReplies[payload.id]?.text || ''}
                  onQuoteReply={handleQuoteReply}
                  key={payload?.id}
                  titleClassName="!flex max-w-full"
                  currentUser={currentUser?.display_name}
                  replyBoxClassName="p-4"
                  isResolved={!!payload?.resolved}
                  toggleConversationStatus={toggleConversationStatus}
                  header={[
                    {
                      avatar: (
                        <Avatar.Root>
                          <Avatar.Fallback>
                            {/* TODO: fix fallback string */}
                            {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                          </Avatar.Fallback>
                        </Avatar.Root>
                      ),
                      name: (payload?.author as PayloadAuthor)?.display_name,
                      // TODO: fix comment to tell between comment or code comment?
                      ...(payload?.created && {
                        description: (
                          <div className="flex gap-x-1">
                            commented
                            {timeAgo(payload?.created)}
                          </div>
                        )
                      })
                    }
                  ]}
                  content={
                    <div className="px-4 pt-4">
                      {commentItems?.map((commentItem, idx) => {
                        const componentId = `activity-comment-${commentItem?.id}`
                        // const diffCommentItem = activitiesToDiffCommentItems(commentItem)
                        const commentIdAttr = `comment-${commentItem?.id}`

                        return payload?.id ? (
                          <PullRequestTimelineItem
                            handleUpload={handleUpload}
                            id={commentIdAttr}
                            data={commentItem.payload?.payload?.text as string}
                            hideReplySection
                            setHideReplyHere={state => toggleReplyBox(state, payload?.id)}
                            quoteReplyText={quoteReplies[payload.id]?.text || ''}
                            onQuoteReply={handleQuoteReply}
                            parentCommentId={payload?.id}
                            toggleConversationStatus={toggleConversationStatus}
                            titleClassName="!flex max-w-full"
                            currentUser={currentUser?.display_name}
                            isLast={commentItems.length - 1 === idx}
                            isComment
                            onCopyClick={onCopyClick}
                            commentId={commentItem.id}
                            isDeleted={!!commentItem?.deleted}
                            handleDeleteComment={() => handleDeleteComment(commentItem?.id)}
                            onEditClick={() => toggleEditMode(componentId, commentItem?.payload?.payload?.text || '')}
                            contentClassName="border-transparent pb-0"
                            replyBoxClassName="p-4"
                            key={`${commentItem.id}-${commentItem.author}-pr-comment`}
                            icon={
                              <Avatar.Root>
                                <Avatar.Fallback>
                                  {/* TODO: fix fallback string */}
                                  {getInitials(
                                    ((commentItem as unknown as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                      .display_name || ''
                                  )}
                                </Avatar.Fallback>
                              </Avatar.Root>
                            }
                            header={[
                              {
                                name: (
                                  (commentItem as unknown as TypesPullReqActivity)?.payload?.author as PayloadAuthor
                                )?.display_name,
                                // TODO: fix comment to tell between comment or code comment?
                                description: (
                                  <Layout.Horizontal>
                                    <span className="text-foreground-3">
                                      {timeAgo((commentItem as unknown as PayloadCreated)?.created)}
                                    </span>
                                    {commentItem?.deleted ? (
                                      <>
                                        <span className="text-foreground-3">&nbsp;|&nbsp;</span>
                                        <span className="text-foreground-3">{t('views:pullRequests.deleted')} </span>
                                      </>
                                    ) : null}
                                  </Layout.Horizontal>
                                )
                              }
                            ]}
                            content={
                              commentItem?.deleted ? (
                                <div className="rounded-md border bg-primary-background p-1">
                                  {t('views:pullRequests.deletedComment')}
                                </div>
                              ) : editModes[componentId] ? (
                                <PullRequestCommentBox
                                  handleUpload={handleUpload}
                                  isEditMode
                                  onSaveComment={() => {
                                    if (commentItem?.id) {
                                      handleUpdateComment?.(commentItem?.id, editComments[componentId])
                                      toggleEditMode(componentId, '')
                                    }
                                  }}
                                  currentUser={currentUser?.display_name}
                                  onCancelClick={() => {
                                    toggleEditMode(componentId, '')
                                  }}
                                  comment={editComments[componentId]}
                                  setComment={text => setEditComments(prev => ({ ...prev, [componentId]: text }))}
                                />
                              ) : (
                                <PRCommentView
                                  commentItem={commentItem}
                                  filenameToLanguage={filenameToLanguage}
                                  suggestionsBatch={suggestionsBatch}
                                  onCommitSuggestion={onCommitSuggestion}
                                  addSuggestionToBatch={addSuggestionToBatch}
                                  removeSuggestionFromBatch={removeSuggestionFromBatch}
                                />
                              )
                            }
                            hideEditDelete={payload?.author?.uid !== currentUser?.uid}
                          />
                        ) : null
                      })}
                    </div>
                    //
                  }
                  icon={<Icon name="pr-comment" size={12} />}
                  isLast={activityBlocks.length - 1 === index}
                  handleSaveComment={handleSaveComment}
                  parentCommentId={payload?.id}
                  hideEditDelete={payload?.author?.uid !== currentUser?.uid}
                />
              ) : null
            }
          })}
        </div>
      </div>
    ) // [activityBlocks, currentUser, pullReqMetadata, activities]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    handleSaveComment,
    pullReqMetadata,
    activityFilter,
    currentUser,
    editModes,
    editComments,
    handleUpdateComment,
    hideReplyHeres
  ])

  return <div>{renderedActivityBlocks}</div>
}

export { PullRequestOverview }
