import { FC } from 'react'

import { Button, Icon } from '@/components'
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
    <div className="inline-flex max-w-full items-center gap-1.5 pl-[22px] text-2 leading-none text-cn-foreground-2">
      <p>
        {`#${number}`} opened {timestamp} by{' '}
        <span className="inline-block max-w-[200px] truncate align-bottom">{author}</span>
      </p>

      <span className="pointer-events-none h-3.5 w-px bg-cn-background-3" aria-hidden />

      <p>{reviewRequired ? 'Review required' : 'Draft'}</p>

      {/* TODO: where did tasks go? */}
      {!!tasks && tasks > 0 && (
        <div className="flex items-center gap-0.5">
          <Icon className="text-icons-1" size={12} name="tasks" />
          <p>
            {tasks} task{tasks === 1 ? '' : 's'}
          </p>
        </div>
      )}
      <span className="pointer-events-none h-3.5 w-px bg-cn-background-3" aria-hidden />

      {sourceBranch && (
        <>
          <Button variant="secondary" size="sm" className="w-full min-w-[60px] max-w-fit justify-start" asChild>
            <Link to={`${relativePath}/code/${targetBranch}`}>
              <Icon name="branch" size={11} className="mr-1 text-cn-foreground-3" />
              <span className="max-w-[calc(100%-15px)] truncate p-0.5 text-2 hover:underline">{targetBranch}</span>
            </Link>
          </Button>

          <span>&larr;</span>
          <Button variant="secondary" size="sm" className="w-full min-w-[60px] max-w-fit justify-start" asChild>
            <Link to={`${relativePath}/code/${sourceBranch}`}>
              <span className="max-w-full truncate p-0.5 text-2 hover:underline">{sourceBranch}</span>
            </Link>
          </Button>
        </>
      )}
    </div>
  )
}
