import { FC } from 'react'

import { ForkTag, IconV2, Layout, Link, Separator, Tag, TagProps, Text, TimeAgoCard } from '@/components'

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
  sourceRepo,
  toUpstreamRepo
}) => {
  const branchTagProps: Omit<TagProps, 'value'> = {
    variant: 'secondary',
    icon: 'git-branch',
    enableHover: true,
    theme: 'gray'
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
          <Link noHoverUnderline to={toBranch?.({ branch: targetBranch, repoId }) || ''}>
            <Tag value={targetBranch} {...branchTagProps} />
          </Link>

          <IconV2 className="text-cn-3" name="arrow-long-left" />

          {sourceRepo ? (
            <ForkTag
              repoIdentifier={sourceRepo.identifier || ''}
              repoPath={sourceRepo.path || ''}
              branchName={sourceBranch}
              toUpstreamRepo={toUpstreamRepo}
            />
          ) : (
            <Link noHoverUnderline to={toBranch?.({ branch: sourceBranch, repoId }) || ''}>
              <Tag value={sourceBranch} {...branchTagProps} />
            </Link>
          )}
        </Layout.Horizontal>
      )}
    </div>
  )
}
PullRequestItemDescription.displayName = 'PullRequestItemDescription'
