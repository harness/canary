import { FC } from 'react'

import { ForkTag, IconV2, Layout, Link, Separator, Tag, TagProps, Text, TimeAgoCard } from '@harnessio/ui/components'

import { EnumPullReqState, PullRequestPageProps, PullRequestType } from '../pull-request.types'

interface PullRequestItemDescriptionProps extends Pick<PullRequestPageProps, 'toBranch'> {
  number: number
  reviewRequired?: boolean
  tasks?: number
  author: string
  sourceBranch: string
  timestamp: string
  state: EnumPullReqState
  targetBranch: string
  repoId: string
  repoPath?: string
  sourceRepo?: PullRequestType['source_repo']
  toUpstreamRepo?: (path: string, subPath?: string) => string
}

export const PullRequestItemDescription: FC<PullRequestItemDescriptionProps> = ({
  number,
  tasks,
  author,
  sourceBranch,
  targetBranch,
  timestamp,
  state,
  toBranch,
  repoId,
  repoPath,
  sourceRepo,
  toUpstreamRepo
}) => {
  const branchTagProps: Omit<TagProps, 'value'> = {
    variant: 'secondary',
    icon: 'git-branch',
    enableHover: true,
    theme: 'gray'
  }

  /**
   * Cross-scope branch links resolve to an absolute parent-app URL (e.g. when a PR from a
   * different org/project is shown in the account-wide list). Those must trigger a full
   * navigation via a plain anchor, since the MFE router cannot resolve a parent-scope path.
   * Same-scope links stay relative and use client-side routing.
   */
  const renderBranchLink = (branchName: string) => {
    const href = toBranch?.({ branch: branchName, repoId, repoPath }) || ''
    const tag = <Tag value={branchName} {...branchTagProps} />

    return /^https?:\/\//.test(href) ? (
      <Link noHoverUnderline external href={href}>
        {tag}
      </Link>
    ) : (
      <Link noHoverUnderline to={href}>
        {tag}
      </Link>
    )
  }

  return (
    <div className="inline-flex max-w-full flex-wrap items-center gap-cn-2xs pl-cn-xl text-cn-size-2 text-cn-2">
      <Text variant="body-single-line-normal">
        {`#${number} ${state === ('open' as EnumPullReqState) ? 'opened' : state} `}
        <TimeAgoCard timestamp={timestamp} /> by{' '}
        <span className="inline-block max-w-[200px] truncate align-text-bottom">{author}</span>
      </Text>

      {/* TODO: where did tasks go? */}
      {!!tasks && tasks > 0 && (
        <div className="flex items-center gap-cn-4xs">
          <IconV2 className="text-cn-3" size="2xs" name="tasks" />
          <Text variant="body-single-line-normal">
            {tasks} task{tasks === 1 ? '' : 's'}
          </Text>
        </div>
      )}
      <Separator orientation="vertical" className="h-3.5" />

      {sourceBranch && (
        <Layout.Horizontal align="center" gap="2xs">
          {renderBranchLink(targetBranch)}

          <IconV2 className="text-cn-3" name="arrow-long-left" />

          {sourceRepo ? (
            <ForkTag
              repoIdentifier={sourceRepo.identifier || ''}
              repoPath={sourceRepo.path || ''}
              branchName={sourceBranch}
              toUpstreamRepo={toUpstreamRepo}
            />
          ) : (
            renderBranchLink(sourceBranch)
          )}
        </Layout.Horizontal>
      )}
    </div>
  )
}
PullRequestItemDescription.displayName = 'PullRequestItemDescription'
