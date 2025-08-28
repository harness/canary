import { FC, useMemo } from 'react'

import { Avatar, BranchTag, CommitCopyActions, IconPropsV2, IconV2, Text, TimeAgoCard } from '@/components'
import { useRouterContext } from '@/context'
import {
  ColorsEnum,
  CommentItem,
  CommentType,
  GeneralPayload,
  LabelActivity,
  LabelTag,
  MergeStrategy,
  PrincipalPropsType,
  ReviewerAddActivity,
  TypesPullReqActivity
} from '@/views'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'
import { noop } from 'lodash-es'

import PullRequestTimelineItem, { TimelineItemProps } from './pull-request-timeline-item'

const labelActivityToTitleDict: Record<LabelActivity, string> = {
  assign: 'added',
  reassign: 'reassigned',
  unassign: 'removed'
}

const formatListWithAndFragment = (names: string[]): React.ReactNode => {
  switch (names?.length) {
    case 0:
      return null
    case 1:
      return (
        <Text as="span" variant="body-single-line-normal" color="foreground-1">
          {names[0]}
        </Text>
      )
    case 2:
      return (
        <>
          <Text as="span" variant="body-single-line-normal" color="foreground-1">
            {names[0]}
          </Text>
          and
          <Text as="span" variant="body-single-line-normal" color="foreground-1">
            {names[1]}
          </Text>
        </>
      )
    default:
      return (
        <>
          {names.slice(0, -1).map((name, index) => (
            <>
              <Text as="span" variant="body-single-line-normal" color="foreground-1">
                {name}
                {index < names.length - 2 ? ', ' : ''}
              </Text>
            </>
          ))}
          and
          <Text as="span" variant="body-single-line-normal" color="foreground-1">
            {names[names.length - 1]}
          </Text>
        </>
      )
  }
}

interface SystemCommentProps extends TypesPullReq {
  commentItems: CommentItem<TypesPullReqActivity>[]
  repoMetadataPath?: string
  isLast: boolean
  pullReqMetadata: TypesPullReq | undefined
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
  principalProps: PrincipalPropsType
  spaceId?: string
  repoId?: string
}
const PullRequestSystemComments: FC<SystemCommentProps> = ({
  commentItems,
  isLast,
  pullReqMetadata,
  toCommitDetails,
  toCode,
  principalProps,
  spaceId,
  repoId
}) => {
  const { navigate } = useRouterContext()

  const payloadMain = useMemo(() => commentItems[0]?.payload, [commentItems])

  const displayNameList = useMemo(() => {
    const checkList = payloadMain?.metadata?.mentions?.ids ?? []
    const uniqueList = [...new Set(checkList)]
    const mentionsMap = payloadMain?.mentions ?? {}
    return uniqueList.map(id => mentionsMap[id]?.display_name ?? '')
  }, [payloadMain?.metadata?.mentions?.ids, payloadMain?.mentions])

  const principalNameList = useMemo(() => {
    const checkList = (payloadMain?.payload as any)?.principal_ids ?? []
    const uniqueList = [...new Set(checkList)]
    const mentionsMap = payloadMain?.mentions ?? {}
    return uniqueList.map(id => mentionsMap[id as number]?.display_name ?? '')
  }, [(payloadMain?.payload as any)?.principal_ids, payloadMain?.mentions])

  const {
    header,
    ...restProps
  }: Partial<Omit<TimelineItemProps, 'header'>> & {
    header: TimelineItemProps['header'][number]
  } = useMemo(() => {
    if (!payloadMain) return { header: {} }

    const { payload, type, author, metadata, mentions, created } = payloadMain

    const {
      old_draft,
      new_draft,
      old,
      new: newData,
      decision,
      forced,
      merge_method,
      merge_sha,
      reviewer_type,
      label,
      label_color,
      value,
      value_color,
      scope
    } = payload as GeneralPayload

    const openFromDraft = old_draft === true && new_draft === false
    const changedToDraft = old_draft === false && new_draft === true

    switch (type) {
      case CommentType.MERGE:
        return {
          header: {
            description: (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  {merge_method === MergeStrategy.REBASE ? 'rebased changes from branch' : 'merged changes from'}
                </Text>
                <BranchTag branchName={pullReqMetadata?.source_branch as string} spaceId={spaceId} repoId={repoId} />
                <Text variant="body-single-line-normal" color="foreground-3">
                  into
                </Text>
                <BranchTag branchName={pullReqMetadata?.target_branch as string} spaceId={spaceId} repoId={repoId} />
                <Text variant="body-single-line-normal" color="foreground-3">
                  {merge_method === MergeStrategy.REBASE ? ', now at ' : 'by commit'}
                </Text>
                <CommitCopyActions toCommitDetails={toCommitDetails} sha={merge_sha as string} />
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon: <IconV2 name="git-merge" size="xs" />
        }

      case CommentType.REVIEW_SUBMIT:
        return {
          hideIconBorder: true,
          // TODO: fix timeline item to handle commit update as rn it doesnt work
          header: {
            description: (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  {decision === 'approved' ? 'approved these changes' : 'requested changes to this pull request'}
                </Text>
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon:
            decision === 'approved' ? (
              <IconV2 name="check-circle-solid" size="md" className="text-cn-foreground-success" />
            ) : (
              <IconV2 name="warning-triangle-solid" size="md" className="text-cn-foreground-danger" />
            )
        }

      case CommentType.BRANCH_UPDATE:
        return {
          header: {
            name: !forced ? `${author?.display_name}` : author?.display_name,
            description: !forced ? (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  pushed a new commit
                </Text>
                <CommitCopyActions toCommitDetails={toCommitDetails} sha={String(newData)} />
                <TimeAgoCard timestamp={created} />
              </>
            ) : (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  forced pushed
                </Text>
                <CommitCopyActions toCommitDetails={toCommitDetails} sha={String(old)} />
                <Text variant="body-single-line-normal" color="foreground-3">
                  to
                </Text>
                <CommitCopyActions toCommitDetails={toCommitDetails} sha={String(newData)} />
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon: <IconV2 name="git-commit" size="xs" />
        }

      case CommentType.BRANCH_RESTORE:
      case CommentType.BRANCH_DELETE: {
        const isSourceBranchDeleted = type === CommentType.BRANCH_DELETE
        const sourceBranch = pullReqMetadata?.source_branch

        return {
          header: {
            description: (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  {isSourceBranchDeleted ? 'deleted the' : 'restored the'}
                </Text>
                {!!sourceBranch && <BranchTag branchName={sourceBranch} spaceId={spaceId} repoId={repoId} />}
                <Text variant="body-single-line-normal" color="foreground-3">
                  branch
                </Text>
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon: <IconV2 name="git-branch" size="xs" />
        }
      }

      case CommentType.STATE_CHANGE: {
        const iconName: IconPropsV2['name'] =
          openFromDraft || changedToDraft
            ? changedToDraft
              ? 'git-pull-request-draft'
              : 'eye'
            : old === 'closed' && newData === 'open'
              ? 'git-pull-request'
              : 'git-pull-request-closed'

        return {
          header: {
            description: (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  {!!changedToDraft && 'marked pull request as draft'}
                  {!!openFromDraft && 'marked pull request as ready for review'}
                  {!changedToDraft && !openFromDraft && `changed pull request state from ${old} to ${newData}`}
                </Text>
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon: <IconV2 name={iconName} size="xs" />
        }
      }

      case CommentType.TITLE_CHANGE:
        return {
          header: {
            description: (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  changed title from&nbsp;
                  <Text className="line-through" as="span" variant="body-single-line-normal" color="foreground-1">
                    {String(old)}
                  </Text>
                  &nbsp;to&nbsp;
                  <Text as="span" variant="body-single-line-normal" color="foreground-1">
                    {String(newData)}
                  </Text>
                </Text>
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon: <IconV2 name="edit-pencil" size="xs" />
        }

      case CommentType.REVIEW_DELETE: {
        const mentionId = metadata?.mentions?.ids?.[0] ?? 0
        const mentionDisplayName = mentions?.[mentionId]?.display_name ?? ''

        return {
          header: {
            description: (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  {author?.id === mentionId ? (
                    'removed their request for review'
                  ) : (
                    <>
                      removed the request for review from&nbsp;
                      <Text as="span" variant="body-single-line-normal" color="foreground-1">
                        {mentionDisplayName}
                      </Text>
                    </>
                  )}
                </Text>
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon: <IconV2 name="edit-pencil" size="xs" />
        }
      }

      case CommentType.REVIEW_ADD: {
        const activityMentions = formatListWithAndFragment(displayNameList)
        const principalMentions = formatListWithAndFragment(principalNameList)

        return {
          header: {
            description: (
              <>
                {reviewer_type === ReviewerAddActivity.SELF_ASSIGNED && 'self-requested a review'}
                {reviewer_type === ReviewerAddActivity.ASSIGNED && <>assigned {activityMentions} as a reviewer</>}
                {reviewer_type === ReviewerAddActivity.REQUESTED && <>requested a review from {activityMentions}</>}
                {reviewer_type === ReviewerAddActivity.CODEOWNERS && (
                  <>
                    requested a review from {principalMentions} as&nbsp;
                    {principalNameList?.length > 1 ? 'code owners' : 'code owner'}
                  </>
                )}
                {reviewer_type === ReviewerAddActivity.DEFAULT && (
                  <>
                    requested a review from {principalMentions} as&nbsp;
                    {principalNameList?.length > 1 ? 'default reviewers' : 'default reviewer'}
                  </>
                )}
              </>
            )
          },
          icon: <IconV2 name="eye" size="xs" />
        }
      }

      case CommentType.LABEL_MODIFY: {
        const labelType = payload?.type as LabelActivity

        return {
          header: {
            description: (
              <>
                <Text variant="body-single-line-normal" color="foreground-3">
                  {labelType ? labelActivityToTitleDict[labelType] : 'modified'}
                </Text>
                <LabelTag
                  scope={scope as number}
                  color={(value_color ?? label_color) as ColorsEnum}
                  labelKey={label as string}
                  labelValue={value as string}
                  tagProps={{ size: 'sm' }}
                />
                <Text variant="body-single-line-normal" color="foreground-3">
                  label
                </Text>
                <TimeAgoCard timestamp={created} />
              </>
            )
          },
          icon: <IconV2 name="edit-pencil" size="xs" />
        }
      }

      default:
        console.warn('Unable to render system type activity')

        return {
          header: {
            description: <span className="text-cn-foreground-3 text-sm">{String(type)}</span>
          }
        }
    }
  }, [payloadMain, pullReqMetadata, toCommitDetails, toCode, navigate])

  if (!payloadMain) return <></>

  return (
    <PullRequestTimelineItem
      // System comments doesn't support mentions
      principalsMentionMap={{}}
      payload={payloadMain}
      setPrincipalsMentionMap={noop}
      principalProps={principalProps}
      key={payloadMain.id}
      header={[
        {
          avatar: <Avatar name={payloadMain?.author?.display_name} rounded />,
          name: payloadMain?.author?.display_name,
          ...header
        }
      ]}
      isLast={isLast}
      {...restProps}
    />
  )
}
PullRequestSystemComments.displayName = 'PullRequestSystemComments'

export default PullRequestSystemComments
