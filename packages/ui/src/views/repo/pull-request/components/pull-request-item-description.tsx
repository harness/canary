import { FC } from 'react'

import { IconV2, Separator, Tag, Text, TimeAgoCard } from '@/components'
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
  reviewRequired,
  number,
  tasks,
  author,
  sourceBranch,
  targetBranch,
  timestamp
}) => {
  const { Link, location } = useRouterContext()
  const fullPath = location.pathname
  const relativePath = fullPath.split('/pulls')[0] // Adjust the slice parameters as needed

  return (
    <div className="text-2 text-cn-foreground-2 inline-flex max-w-full items-center gap-1.5 pl-[22px]">
      <Text variant="body-single-line-normal">
        {`#${number}`} opened <TimeAgoCard timestamp={timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} /> by{' '}
        <span className="inline-block max-w-[200px] truncate align-text-bottom">{author}</span>
      </Text>

      <Separator orientation="vertical" className="h-3.5" />

      <Text variant="body-single-line-normal">{reviewRequired ? 'Review required' : 'Draft'}</Text>

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
        <>
          <Link to={`${relativePath}/files/${targetBranch}`}>
            <Tag variant="secondary" icon="git-branch" value={targetBranch} showIcon enableHover />
          </Link>

          <span>&larr;</span>
          <Link to={`${relativePath}/files/${sourceBranch}`}>
            <Tag variant="secondary" icon="git-branch" value={sourceBranch} showIcon enableHover />
          </Link>
        </>
      )}
    </div>
  )
}
