import { FC } from 'react'

import { IconV2, Layout, Link, Separator, Tag, TagProps, Text, TimeAgoCard } from '@/components'
import { useRouterContext } from '@/context'

interface PullRequestItemDescriptionProps {
  number: number
  reviewRequired?: boolean
  tasks?: number
  author: string
  sourceBranch: string
  timestamp: string
  targetBranch: string
}

export const PullRequestItemDescription: FC<PullRequestItemDescriptionProps> = ({
  number,
  tasks,
  author,
  sourceBranch,
  targetBranch,
  timestamp
}) => {
  const { location } = useRouterContext()
  const fullPath = location.pathname
  const relativePath = fullPath.split('/pulls')[0] // Adjust the slice parameters as needed

  const branchTagProps: Omit<TagProps, 'value'> = {
    variant: 'secondary',
    icon: 'git-branch',
    enableHover: true,
    theme: 'gray'
  }

  return (
    <div className="text-2 text-cn-2 inline-flex flex-wrap max-w-full items-center gap-1.5 pl-[22px]">
      <Text variant="body-single-line-normal">
        {`#${number}`} opened <TimeAgoCard timestamp={timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} /> by{' '}
        <span className="inline-block max-w-[200px] truncate align-text-bottom">{author}</span>
      </Text>

      {/* TODO: where did tasks go? */}
      {!!tasks && tasks > 0 && (
        <div className="flex items-center gap-0.5">
          <IconV2 className="text-icons-1" size="2xs" name="tasks" />
          <Text variant="body-single-line-normal">
            {tasks} task{tasks === 1 ? '' : 's'}
          </Text>
        </div>
      )}
      <Separator orientation="vertical" className="h-3.5" />

      {sourceBranch && (
        <Layout.Horizontal align="center" gap="2xs">
          <Link noHoverUnderline to={`${relativePath}/files/${targetBranch}`}>
            <Tag value={targetBranch} {...branchTagProps} />
          </Link>

          <IconV2 className="text-cn-3" name="arrow-long-left" />

          <Link noHoverUnderline to={`${relativePath}/files/${sourceBranch}`}>
            <Tag value={sourceBranch} {...branchTagProps} />
          </Link>
        </Layout.Horizontal>
      )}
    </div>
  )
}
PullRequestItemDescription.displayName = 'PullRequestItemDescription'
