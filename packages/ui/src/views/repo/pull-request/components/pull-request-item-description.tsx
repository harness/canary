import { FC } from 'react'

import { IconV2, Layout, Link, Separator, Tag, TagProps, Text, TimeAgoCard } from '@/components'

import { EnumPullReqState, PullRequestPageProps } from '../pull-request.types'

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
  repoId
}) => {
  const branchTagProps: Omit<TagProps, 'value'> = {
    variant: 'secondary',
    icon: 'git-branch',
    enableHover: true,
    theme: 'gray'
  }

  return (
    <div className="text-cn-size-2 text-cn-2 inline-flex flex-wrap max-w-full items-center gap-cn-2xs pl-cn-xl">
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

          <Link noHoverUnderline to={toBranch?.({ branch: sourceBranch, repoId }) || ''}>
            <Tag value={sourceBranch} {...branchTagProps} />
          </Link>
        </Layout.Horizontal>
      )}
    </div>
  )
}
PullRequestItemDescription.displayName = 'PullRequestItemDescription'
