import { FC, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { Avatar, CommitCopyActions, Icon, IconProps, LabelMarker, Layout, Text } from '@/components'
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
  const navigate = useNavigate()

  const payloadMain = useMemo(() => {
    return commentItems[0]?.payload
  }, [commentItems])

  const {
    header,
    ...restProps
  }: Partial<Omit<TimelineItemProps, 'header'>> & {
    header: TimelineItemProps['header'][number]
  } = useMemo(() => {
    if (!payloadMain)
      return {
        header: {}
      }

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
      value
    } = payload as GeneralPayload

    const openFromDraft = old_draft === true && new_draft === false
    const changedToDraft = old_draft === false && new_draft === true

    switch (type) {
      case CommentType.MERGE:
        return {
          header: {
            description: (
              <span className=" flex items-center gap-x-1 text-14 text-foreground-4">
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
              <Icon name="success" size={18} className="text-foreground-success" />
            ) : (
              <Icon name="triangle-warning" size={18} className="text-destructive" />
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
              <span className="flex items-center gap-x-1 text-14 text-foreground-4">
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
              <>
                {openFromDraft || changedToDraft ? (
                  <Text color="tertiaryBackground">
                    {changedToDraft ? 'marked pull request as draft' : 'opened pull request for review'}
                  </Text>
                ) : (
                  <Text color="tertiaryBackground">{`changed pull request state from ${old} to ${newData}`}</Text>
                )}
              </>
            )
          },
          icon: <Icon name={iconName} size={12} />
        }
      }

      case CommentType.TITLE_CHANGE:
        return {
          header: {
            description: (
              <Text color="tertiaryBackground">
                changed title from <span className="line-through">{String(old)}</span> to {String(newData)}
              </Text>
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
              <Text color="tertiaryBackground">
                {author?.id === mentionId
                  ? 'removed their request for review'
                  : `removed the request for review from ${mentionDisplayName}`}
              </Text>
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
              <Text color="tertiaryBackground">
                {reviewer_type === ReviewerAddActivity.SELF_ASSIGNED
                  ? 'self-requested a review'
                  : reviewer_type === ReviewerAddActivity.ASSIGNED
                    ? `assigned ${mentionDisplayName} as a reviewer`
                    : `requested a review from ${mentionDisplayName}`}
              </Text>
            )
          },
          icon: <Icon name="pr-review" size={14} className="p-0.5" />
        }
      }

      case CommentType.LABEL_MODIFY: {
        const labelType = type as LabelActivity

        return {
          header: {
            description: (
              <Text color="tertiaryBackground">
                {labelType === LabelActivity.ASSIGN
                  ? 'applied'
                  : labelType === LabelActivity.RE_ASSIGN
                    ? 'reassigned'
                    : 'removed'}{' '}
                label{'  '}
                <LabelMarker
                  key={label as string}
                  color={label_color as ColorsEnum}
                  label={label as string}
                  value={value as string}
                />
              </Text>
            )
          },
          icon: <Icon name="edit-pen" size={14} className="p-0.5" />
        }
      }

      default:
        console.warn('Unable to render system type activity')

        return {
          header: {
            description: <Text color="tertiaryBackground">{String(type)}</Text>
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
          avatar: (
            <Avatar.Root>
              <Avatar.Fallback>{getInitials(payloadMain?.author?.display_name || '')}</Avatar.Fallback>
            </Avatar.Root>
          ),
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
