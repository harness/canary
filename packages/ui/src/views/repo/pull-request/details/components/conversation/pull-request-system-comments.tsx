import { FC, useMemo } from 'react'

import { Avatar, CommitCopyActions, Icon, IconProps, Layout, Tag } from '@/components'
import { useRouterContext } from '@/context'
import {
  ColorsEnum,
  CommentItem,
  CommentType,
  GeneralPayload,
  LabelActivity,
  MergeStrategy,
  ReviewerAddActivity,
  TypesPullReqActivity
} from '@/views'
import { getInitials } from '@utils/stringUtils'
import { TypesPullReq } from '@views/repo/pull-request/pull-request.types'

import PullRequestBranchBadge from './pull-request-branch-badge'
import PullRequestTimelineItem, { TimelineItemProps } from './pull-request-timeline-item'

const labelActivityToTitleDict: Record<LabelActivity, string> = {
  assign: 'added',
  reassign: 'reassigned',
  unassign: 'removed'
}

interface SystemCommentProps extends TypesPullReq {
  commentItems: CommentItem<TypesPullReqActivity>[]
  repoMetadataPath?: string
  isLast: boolean
  pullReqMetadata: TypesPullReq | undefined
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
}
const PullRequestSystemComments: FC<SystemCommentProps> = ({
  commentItems,
  isLast,
  pullReqMetadata,
  toCommitDetails,
  toCode
}) => {
  const { navigate } = useRouterContext()

  const payloadMain = useMemo(() => commentItems[0]?.payload, [commentItems])

  const {
    header,
    ...restProps
  }: Partial<Omit<TimelineItemProps, 'header'>> & {
    header: TimelineItemProps['header'][number]
  } = useMemo(() => {
    if (!payloadMain) return { header: {} }

    const handleNavigation = (url?: string) => {
      navigate(url || '')
    }

    const { payload, type, author, metadata, mentions } = payloadMain

    const {
      old_draft,
      new_draft,
      old,
      new: newData,
      decision,
      forced,
      commit_title,
      merge_method,
      merge_sha,
      reviewer_type,
      label,
      label_color,
      value,
      value_color
    } = payload as GeneralPayload

    const openFromDraft = old_draft === true && new_draft === false
    const changedToDraft = old_draft === false && new_draft === true

    switch (type) {
      case CommentType.MERGE:
        return {
          header: {
            description: (
              <span className="flex items-center gap-x-1 text-2 text-cn-foreground-2">
                {merge_method === MergeStrategy.REBASE ? 'rebased changes from branch' : 'merged changes from'}
                <PullRequestBranchBadge
                  branchName={pullReqMetadata?.source_branch as string}
                  onClick={() => handleNavigation(toCode?.({ sha: pullReqMetadata?.source_branch as string }))}
                />
                into
                <PullRequestBranchBadge
                  branchName={pullReqMetadata?.target_branch as string}
                  onClick={() => handleNavigation(toCode?.({ sha: pullReqMetadata?.target_branch as string }))}
                />
                {merge_method === MergeStrategy.REBASE ? ', now at ' : 'by commit'}
                <CommitCopyActions toCommitDetails={toCommitDetails} sha={merge_sha as string} />
              </span>
            )
          },
          icon: <Icon name="pr-merge" size={12} />
        }

      case CommentType.REVIEW_SUBMIT:
        return {
          hideIconBorder: true,
          // TODO: fix timeline item to handle commit update as rn it doesnt work
          header: {
            description: decision === 'approved' ? 'approved these changes' : 'requested changes to this pull request'
          },
          icon:
            decision === 'approved' ? (
              <Icon name="success" size={18} className="text-cn-foreground-success" />
            ) : (
              <Icon name="triangle-warning" size={18} className="text-cn-foreground-danger" />
            )
        }

      case CommentType.BRANCH_UPDATE:
        return {
          header: {
            name: !forced
              ? String(commit_title) || `${author?.display_name} pushed a new commit`
              : author?.display_name,
            description: !forced ? (
              <CommitCopyActions toCommitDetails={toCommitDetails} sha={String(newData)} />
            ) : (
              <Layout.Horizontal gap="gap-x-1.5" className="items-center">
                <span>forced pushed</span>
                <CommitCopyActions toCommitDetails={toCommitDetails} sha={String(old)} />
                <span>to</span>
                <CommitCopyActions toCommitDetails={toCommitDetails} sha={String(newData)} />
              </Layout.Horizontal>
            )
          },
          icon: <Icon name="tube-sign" size={14} />
        }

      case CommentType.BRANCH_RESTORE:
      case CommentType.BRANCH_DELETE: {
        const isSourceBranchDeleted = type === CommentType.BRANCH_DELETE
        const sourceBranch = pullReqMetadata?.source_branch

        return {
          header: {
            description: (
              <span className="flex items-center gap-x-1 text-2 text-cn-foreground-2">
                {isSourceBranchDeleted ? 'deleted the' : 'restored the'}
                {!!sourceBranch && (
                  <PullRequestBranchBadge
                    branchName={sourceBranch}
                    onClick={() => handleNavigation(toCode?.({ sha: sourceBranch as string }))}
                  />
                )}
                branch
              </span>
            )
          },
          icon: <Icon name="git-branch" size={12} />
        }
      }

      case CommentType.STATE_CHANGE: {
        const iconName: IconProps['name'] =
          openFromDraft || changedToDraft
            ? changedToDraft
              ? 'pr-draft'
              : 'pr-review'
            : old === 'closed' && newData === 'open'
              ? 'pr-open'
              : 'pr-closed'

        return {
          header: {
            description: (
              <span className="text-sm text-cn-foreground-3">
                {!!changedToDraft && 'This pull request is now a draft'}
                {!!openFromDraft && 'This pull request is no longer a draft'}
                {!changedToDraft && !openFromDraft && `changed pull request state from ${old} to ${newData}`}
              </span>
            )
          },
          icon: <Icon name={iconName} size={12} />
        }
      }

      case CommentType.TITLE_CHANGE:
        return {
          header: {
            description: (
              <span className="text-sm text-cn-foreground-3">
                changed title from <span className="line-through">{String(old)}</span> to {String(newData)}
              </span>
            )
          },
          icon: <Icon name="edit-pen" size={14} className="p-0.5" />
        }

      case CommentType.REVIEW_DELETE: {
        const mentionId = metadata?.mentions?.ids?.[0] ?? 0
        const mentionDisplayName = mentions?.[mentionId]?.display_name ?? ''

        return {
          header: {
            description: (
              <span className="text-sm text-cn-foreground-3">
                {author?.id === mentionId
                  ? 'removed their request for review'
                  : `removed the request for review from ${mentionDisplayName}`}
              </span>
            )
          },
          icon: <Icon name="edit-pen" size={14} className="p-0.5" />
        }
      }

      case CommentType.REVIEW_ADD: {
        const mentionId = metadata?.mentions?.ids?.[0] ?? 0
        const mentionDisplayName = mentions?.[mentionId]?.display_name ?? ''

        return {
          header: {
            description: (
              <span className="text-sm text-cn-foreground-3">
                {reviewer_type === ReviewerAddActivity.SELF_ASSIGNED && 'self-requested a review'}
                {reviewer_type === ReviewerAddActivity.ASSIGNED && `assigned ${mentionDisplayName} as a reviewer`}
                {reviewer_type === ReviewerAddActivity.REQUESTED && `requested a review from ${mentionDisplayName}`}
              </span>
            )
          },
          icon: <Icon name="pr-review" size={14} className="p-0.5" />
        }
      }

      case CommentType.LABEL_MODIFY: {
        const labelType = payload?.type as LabelActivity

        return {
          header: {
            description: (
              <span className="inline-flex items-center text-sm text-cn-foreground-3">
                {labelType ? labelActivityToTitleDict[labelType] : 'modified'}
                <div className="mx-1.5">
                  <Tag
                    variant="secondary"
                    size="sm"
                    key={label as string}
                    label={label as string}
                    value={value as string}
                    theme={(value_color ?? label_color) as ColorsEnum}
                  />
                </div>
                label
              </span>
            )
          },
          icon: <Icon name="edit-pen" size={14} className="p-0.5" />
        }
      }

      default:
        console.warn('Unable to render system type activity')

        return {
          header: {
            description: <span className="text-sm text-cn-foreground-3">{String(type)}</span>
          }
        }
    }
  }, [payloadMain, pullReqMetadata, toCommitDetails, toCode, navigate])

  if (!payloadMain) return <></>

  return (
    <PullRequestTimelineItem
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

export default PullRequestSystemComments
