import { useMemo } from 'react'

import { Avatar, AvatarFallback, Button, Icon, Layout, MarkdownViewer, Text } from '@components/index'
import { DiffModeEnum } from '@git-diff-view/react'
import { getInitials } from '@utils/stringUtils'
import { timeAgo } from '@utils/utils'
import { TranslationStore } from '@views/index'
import PullRequestDiffViewer from '@views/repo/pull-request/diff-viewer/pull-request-diff-viewer'
import { useDiffConfig } from '@views/repo/pull-request/hooks/useDiffConfig'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'
import { parseStartingLineIfOne } from '@views/repo/pull-request/utils'
import { get, orderBy } from 'lodash-es'

import {
  CommentItem,
  EnumPullReqActivityType,
  GeneralPayload,
  orderSortDate,
  PayloadAuthor,
  PayloadCodeComment,
  PayloadCreated,
  PRCommentFilterType,
  TypesPullReqActivity
} from '../../pull-request-details-types'
import { isCodeComment, isComment, isSystemComment, removeLastPlus } from '../../pull-request-utils'
import PullRequestDescBox from './pull-request-description-box'
import { PullRequestStatusSelect } from './pull-request-status-select-button'
import PullRequestSystemComments from './pull-request-system-comments'
import PullRequestTimelineItem from './pull-request-timeline-item'

interface PullRequestOverviewProps {
  data?: TypesPullReqActivity[]
  currentUser?: { display_name?: string; uid?: string }
  handleSaveComment: (comment: string, parentId?: number) => void
  refetchActivities: () => void
  useTranslationStore: () => TranslationStore

  // data: CommentItem<TypesPullReqActivity>[][]
  pullReqMetadata: TypesPullReq | undefined
  activityFilter: { label: string; value: string }
  dateOrderSort: { label: string; value: string } // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  commentStatusPullReq: any
  repoId: string
  diffData?: { text: string; numAdditions?: number; numDeletions?: number; data?: string; title: string; lang: string }
}
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

const PullRequestOverview: React.FC<PullRequestOverviewProps> = ({
  data,
  pullReqMetadata,
  activityFilter,
  dateOrderSort,
  handleSaveComment,
  commentStatusPullReq,
  repoId,
  refetchActivities,
  currentUser,
  useTranslationStore
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
  }, [
    data,
    handleSaveComment,
    // dateOrderSort,
    activityFilter,
    currentUser?.uid
  ])

  const renderedActivityBlocks = useMemo(() => {
    return (
      <div className="flex flex-col">
        <div>
          {activityFilter.value === PRCommentFilterType.SHOW_EVERYTHING && (
            <PullRequestDescBox
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
                  key={index}
                  commentItems={commentItems}
                  isLast={activityBlocks.length - 1 === index}
                  pullReqMetadata={pullReqMetadata}
                />
              )
            } else {
              const payload = commentItems[0]?.payload?.payload // Ensure payload is typed correctly
              const codeDiffSnapshot = [
                `diff --git a/src b/dest`,
                `new file mode 100644`,
                'index 0000000..0000000',
                `--- a/src/${get(payload, 'code_comment.path')}`,
                `+++ b/dest/${get(payload, 'code_comment.path')}`,
                `${get(payload, 'payload.title', '')} ttttt`,
                ...get(payload, 'payload.lines', [])
              ].join('\n')
              if (payload?.type === ('code-comment' as EnumPullReqActivityType)) {
                const startingLine =
                  parseStartingLineIfOne(codeDiffSnapshot ?? '') !== null
                    ? parseStartingLineIfOne(codeDiffSnapshot ?? '')
                    : null
                return (
                  <PullRequestTimelineItem
                    key={payload?.id}
                    header={[
                      {
                        avatar: (
                          <Avatar className="size-6 rounded-full p-0">
                            {/* <AvatarImage src={AvatarUrl} /> */}

                            <AvatarFallback>
                              <Text size={1} color="tertiaryBackground">
                                {/* TODO: fix fallback string */}
                                {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                              </Text>
                            </AvatarFallback>
                          </Avatar>
                        ),
                        name: (payload?.author as PayloadAuthor)?.display_name,
                        // TODO: fix comment to tell between comment or code comment?
                        description: payload?.created && `reviewed ${timeAgo(payload?.created)}`
                      }
                    ]}
                    content={
                      <div className="flex flex-col pt-2">
                        <div className="flex w-full items-center justify-between px-4 pb-2">
                          <Text size={3} color="primary">
                            {(payload?.code_comment as PayloadCodeComment)?.path}
                          </Text>
                          <div className="flex items-center gap-x-2">
                            {/* TODO: fix states on this on a comment like resolved and active */}
                            <PullRequestStatusSelect
                              refetchActivities={refetchActivities}
                              commentStatusPullReq={commentStatusPullReq}
                              comment={{ commentItems: commentItems }}
                              pullReqMetadata={pullReqMetadata}
                              repoId={repoId}
                            />
                            {/* TODO: add on click or other menu options */}
                            <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1">
                              <Icon name="vertical-ellipsis" size={12} />
                            </Button>
                          </div>
                        </div>
                        {startingLine ? (
                          <div className="bg-[--diff-hunk-lineNumber--]">
                            <div className="ml-16 w-full px-8 py-1 font-mono">{startingLine}</div>
                          </div>
                        ) : null}

                        <PullRequestDiffViewer
                          data={removeLastPlus(codeDiffSnapshot)}
                          fileName={payload?.code_comment?.path ?? ''}
                          lang={(payload?.code_comment?.path && payload?.code_comment?.path.split('.').pop()) || ''}
                          fontsize={fontsize}
                          highlight={highlight}
                          mode={DiffModeEnum.Unified}
                          wrap={wrap}
                          addWidget={false}
                        />
                        <div className="px-4 py-2">
                          {commentItems?.map((commentItem, idx) => {
                            return (
                              <PullRequestTimelineItem
                                icon={
                                  <Avatar className="size-6 rounded-full p-0">
                                    {/* <AvatarImage src={AvatarUrl} /> */}

                                    <AvatarFallback>
                                      <Text size={1} color="tertiaryBackground">
                                        {/* TODO: fix fallback string */}
                                        {getInitials(
                                          ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                            ?.display_name || ''
                                        )}
                                      </Text>
                                    </AvatarFallback>
                                  </Avatar>
                                }
                                isLast={commentItems.length - 1 === idx}
                                header={[
                                  {
                                    name: ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                      ?.display_name,
                                    // TODO: fix comment to tell between comment or code comment?
                                    description: (
                                      <Layout.Horizontal>
                                        <span className="text-foreground-3">
                                          {timeAgo((commentItem as PayloadCreated)?.created)}
                                        </span>
                                        {commentItem?.deleted ? (
                                          <>
                                            <span className="text-foreground-3">&nbsp;|&nbsp;</span>
                                            <span className="text-foreground-3">
                                              {t('views:pullRequests.deleted')}{' '}
                                            </span>
                                          </>
                                        ) : null}
                                      </Layout.Horizontal>
                                    )
                                  }
                                ]}
                                hideReply
                                contentClassName="border-transparent"
                                content={
                                  commentItem?.deleted ? (
                                    <div className="rounded-md border bg-primary-background p-1">
                                      {t('views:pullRequests.deletedComment')}
                                    </div>
                                  ) : (
                                    <MarkdownViewer source={commentItem?.payload?.payload?.text || ''} />
                                  )
                                }
                                key={`${commentItem.id}-${commentItem.author}`}
                              />
                            )
                          })}
                        </div>
                      </div>
                      //
                    }
                    icon={<Icon name="pr-review" size={12} />}
                    isLast={(data && data?.length - 1 === index) ?? false}
                    handleSaveComment={handleSaveComment}
                    parentCommentId={payload?.id}
                  />
                )
              }
              return (
                <PullRequestTimelineItem
                  key={payload?.id}
                  titleClassName="!flex max-w-full"
                  header={[
                    {
                      avatar: (
                        <Avatar className="size-6 rounded-full p-0">
                          {/* <AvatarImage src={AvatarUrl} /> */}

                          <AvatarFallback>
                            <Text size={1} color="tertiaryBackground">
                              {/* TODO: fix fallback string */}
                              {getInitials((payload?.author as PayloadAuthor)?.display_name || '')}
                            </Text>
                          </AvatarFallback>
                        </Avatar>
                      ),
                      name: (payload?.author as PayloadAuthor)?.display_name,
                      // TODO: fix comment to tell between comment or code comment?
                      description: (
                        <div className="flex space-x-4">
                          <div className="pr-2">{payload?.created && `commented ${timeAgo(payload?.created)}`} </div>
                        </div>
                      ),
                      selectStatus: (
                        <div className="flex items-center gap-x-2">
                          <PullRequestStatusSelect
                            refetchActivities={refetchActivities}
                            commentStatusPullReq={commentStatusPullReq}
                            comment={{
                              commentItems: commentItems
                            }}
                            pullReqMetadata={pullReqMetadata}
                            repoId={repoId}
                          />
                          <Button name="vertical-ellipsis" size="sm" variant="ghost" className="rotate-90">
                            <Icon name="vertical-ellipsis" size={12} />
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  content={
                    <div className="px-4 pt-4">
                      {commentItems?.map((commentItem, idx) => {
                        return (
                          <PullRequestTimelineItem
                            icon={
                              <Avatar className="size-6 rounded-full p-0">
                                {/* <AvatarImage src={AvatarUrl} /> */}

                                <AvatarFallback>
                                  <Text size={1} color="tertiaryBackground">
                                    {/* TODO: fix fallback string */}
                                    {getInitials(
                                      ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                        .display_name || ''
                                    )}
                                  </Text>
                                </AvatarFallback>
                              </Avatar>
                            }
                            isLast={commentItems.length - 1 === idx}
                            header={[
                              {
                                name: ((commentItem as TypesPullReqActivity)?.payload?.author as PayloadAuthor)
                                  ?.display_name,
                                // TODO: fix comment to tell between comment or code comment?
                                description: (
                                  <Layout.Horizontal>
                                    <span className="text-foreground-3">
                                      {timeAgo((commentItem as PayloadCreated)?.created)}
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
                            hideReply
                            contentClassName="border-transparent pb-0"
                            content={
                              <div className="flex py-1">
                                {commentItem?.deleted ? (
                                  <div className="rounded-md border bg-primary-background p-1">
                                    {t('views:pullRequests.deletedComment')}
                                  </div>
                                ) : (
                                  <MarkdownViewer source={commentItem?.payload?.payload?.text || ''} />
                                )}
                              </div>
                            }
                            key={`${commentItem.id}-${commentItem.author}-pr-comment`}
                          />
                        )
                      })}
                    </div>
                    //
                  }
                  icon={<Icon name="pr-comment" size={12} />}
                  isLast={activityBlocks.length - 1 === index}
                  handleSaveComment={handleSaveComment}
                  parentCommentId={payload?.id}
                />
              )
            }
          })}
        </div>
      </div>
    ) // [activityBlocks, currentUser, pullReqMetadata, activities]
  }, [data, handleSaveComment, pullReqMetadata, activityFilter, currentUser])

  return <div>{renderedActivityBlocks}</div>
}

export { PullRequestOverview }
