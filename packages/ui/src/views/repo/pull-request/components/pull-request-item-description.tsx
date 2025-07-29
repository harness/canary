import { FC } from 'react'

import { IconV2, Tag, Text, TimeAgoCard } from '@/components'
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
    <div className="inline-flex max-w-full items-center gap-1.5 pl-[22px] text-2 text-cn-foreground-2">
      <Text>
        {`#${number}`} opened <TimeAgoCard timestamp={timestamp} dateTimeFormatOptions={{ dateStyle: 'medium' }} /> by{' '}
        <span className="inline-block max-w-[200px] truncate align-bottom">{author}</span>
      </Text>

      <span className="pointer-events-none h-3.5 w-px bg-cn-background-3" aria-hidden />

      <p>{reviewRequired ? 'Review required' : 'Draft'}</p>

      {/* TODO: where did tasks go? */}
      {!!tasks && tasks > 0 && (
        <div className="flex items-center gap-0.5">
          <IconV2 className="text-icons-1" size="2xs" name="tasks" />
          <p>
            {tasks} task{tasks === 1 ? '' : 's'}
          </p>
        </div>
      )}
      <span className="pointer-events-none h-3.5 w-px bg-cn-background-3" aria-hidden />

      {sourceBranch && (
        <>
          <Link to={`${relativePath}/code/${targetBranch}`}>
            <Tag variant="secondary" icon="git-branch" value={targetBranch} showIcon />
          </Link>

          <span>&larr;</span>
          <Link to={`${relativePath}/code/${sourceBranch}`}>
            <Tag variant="secondary" icon="git-branch" value={sourceBranch} showIcon />
          </Link>
        </>
      )}
    </div>
  )
}
