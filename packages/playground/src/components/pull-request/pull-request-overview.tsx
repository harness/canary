import React, { useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage, Button, Icon, Text } from '@harnessio/canary'
import {
  CommentItem,
  EnumPullReqActivityType,
  GeneralPayload,
  orderSortDate,
  PayloadAuthor,
  PayloadCodeComment,
  PayloadCreated,
  PRCommentFilterType,
  TypesPullReq,
  TypesPullReqActivity
} from './interfaces'
import { isCodeComment, isComment, isSystemComment } from './utils'
import PullRequestTimelineItem from './pull-request-timeline-item'
import PullRequestSystemComments from './pull-request-system-comments'
import { orderBy } from 'lodash-es'
import PullRequestDiffViewer from './pull-request-diff-viewer'
import { useDiffConfig } from './hooks/useDiffConfig'
import { DiffModeEnum } from '@git-diff-view/react'
import PullRequestDescBox from './pull-request-description-box'
import { getInitials, timeAgo } from '../../utils/utils'
import AvatarUrl from '../../../public/images/user-avatar.svg'

interface PullRequestOverviewProps {
  data?: TypesPullReqActivity[]
  currentUser?: string
  handleSaveComment: (comment: string, parentId?: number) => void
  // data: CommentItem<TypesPullReqActivity>[][]
  pullReqMetadata: TypesPullReq | undefined
  activityFilter: { label: string; value: string }
  dateOrderSort: { label: string; value: string }
  diffData?:
    | {
        oldFile?: {
          fileName?: string | null
          fileLang?: string | null
          content?: string | null
        }
        newFile?: {
          fileName?: string | null
          fileLang?: string | null
          content?: string | null
        }
        hunks: string[]
      }
    | undefined
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
  diffData,
  handleSaveComment
}) => {
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

      // case PRCommentFilterType.MY_COMMENTS: {
      //   const allCommentBlock = blocks?.filter(_activities => !isSystemComment(_activities))
      //   const userCommentsOnly = allCommentBlock?.filter(_activities => {
      //     const userCommentReply = _activities?.filter(
      //       authorIsUser => currentUser?.uid && authorIsUser.payload?.author?.uid === currentUser?.uid
      //     )
      //     return userCommentReply.length !== 0
      //   })
      //   return userCommentsOnly
      // }
    }

    return blocks
  }, [
    data,
    handleSaveComment
    // dateOrderSort,
    // activityFilter
    // currentUser?.uid
  ])
  const renderedActivityBlocks = useMemo(() => {
    return (
      <div className="flex flex-col">
        <div>
          <PullRequestDescBox
            createdAt={pullReqMetadata?.created}
            isLast={!(activityBlocks?.length > 0)}
            author={pullReqMetadata?.author?.display_name}
            prNum={`#${pullReqMetadata?.number}`}
            description={pullReqMetadata?.description}
          />
          {activityBlocks?.map((commentItems, index) => {
            if (isSystemComment(commentItems)) {
              return (
                <PullRequestSystemComments
                  commentItems={commentItems}
                  isLast={activityBlocks.length - 1 === index}
                  pullReqMetadata={pullReqMetadata}
                />
              )
            } else {
              const payload = commentItems[0]?.payload?.payload // Ensure payload is typed correctly

              if (payload?.type === ('code-comment' as EnumPullReqActivityType)) {
                return (
                  <PullRequestTimelineItem
                    key={index} // Consider using a unique ID if available
                    header={[
                      {
                        avatar: (
                          <Avatar className="w-6 h-6 rounded-full p-0">
                            <AvatarImage src={AvatarUrl} />

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
                      <div className="flex flex-col   pt-2">
                        <div className="flex items-center w-full px-4 pb-2 justify-between">
                          <Text size={3} color="primary">
                            {(payload?.code_comment as PayloadCodeComment)?.path}
                          </Text>
                          <div className="flex">
                            {/* TODO: fix states on this on a comment like resolved and active */}
                            <Text size={1} className="flex items-center gap-1 pr-2" color={'tertiaryBackground'}>
                              Resolved
                              <Icon size={14} name="chevron-down" />
                            </Text>
                            {/* TODO: add on click or other menu options */}
                            <Button size="sm" variant="ghost" className="rotate-90 px-2 py-1 ">
                              <Icon name="vertical-ellipsis" size={12} />
                            </Button>
                          </div>
                        </div>
                        <PullRequestDiffViewer
                          data={diffData}
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
                                  <Avatar className="w-6 h-6 rounded-full p-0">
                                    <AvatarImage src={AvatarUrl} />

                                    <AvatarFallback>
                                      <Text size={1} color="tertiaryBackground">
                                        {/* TODO: fix fallback string */}
                                        {getInitials(
                                          ((commentItem as TypesPullReqActivity)?.author as PayloadAuthor)
                                            ?.display_name || ''
                                        )}
                                      </Text>
                                    </AvatarFallback>
                                  </Avatar>
                                }
                                isLast={commentItems.length - 1 === idx}
                                header={[
                                  {
                                    name: ((commentItem as TypesPullReqActivity)?.author as PayloadAuthor)
                                      ?.display_name,
                                    // TODO: fix comment to tell between comment or code comment?
                                    description:
                                      commentItem.created && `${timeAgo((commentItem as PayloadCreated)?.created)}`
                                  }
                                ]}
                                hideReply
                                contentClassName="border-transparent"
                                content={
                                  <div className="flex py-1">
                                    <Text size={2} color="primary">
                                      {commentItem.payload?.payload?.text as string}
                                    </Text>
                                  </div>
                                }
                                key={`${commentItem.id}-${commentItem.author}-${idx}`}
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
                  key={index} // Consider using a unique ID if available
                  header={[
                    {
                      avatar: (
                        <Avatar className="w-6 h-6 rounded-full p-0">
                          <AvatarImage src={AvatarUrl} />

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
                      description: payload?.created && `commented ${timeAgo(payload?.created)}`
                    }
                  ]}
                  content={
                    <div className="px-4 pt-4">
                      {commentItems?.map((commentItem, idx) => {
                        return (
                          <PullRequestTimelineItem
                            icon={
                              <Avatar className="w-6 h-6 rounded-full p-0">
                                <AvatarImage src={AvatarUrl} />

                                <AvatarFallback>
                                  <Text size={1} color="tertiaryBackground">
                                    {/* TODO: fix fallback string */}
                                    {getInitials(
                                      ((commentItem as TypesPullReqActivity)?.author as PayloadAuthor).display_name ||
                                        ''
                                    )}
                                  </Text>
                                </AvatarFallback>
                              </Avatar>
                            }
                            isLast={commentItems.length - 1 === idx}
                            header={[
                              {
                                name: ((commentItem as TypesPullReqActivity)?.author as PayloadAuthor)?.display_name,
                                // TODO: fix comment to tell between comment or code comment?
                                description:
                                  commentItem?.created && `${timeAgo((commentItem as PayloadCreated)?.created)}`
                              }
                            ]}
                            hideReply
                            contentClassName="border-transparent pb-0"
                            content={
                              <div className="flex py-1">
                                <Text size={2} color="primary">
                                  {commentItem.payload?.payload?.text as string}
                                </Text>
                              </div>
                            }
                            key={`${commentItem.id}-${commentItem.author}-${idx}`}
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
  }, [data, handleSaveComment, pullReqMetadata])

  return <div>{renderedActivityBlocks}</div>
}

export { PullRequestOverview }
