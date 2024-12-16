import { FC } from 'react'
import { Link, useResolvedPath } from 'react-router-dom'

import { Button, Icon, Text } from '@/components'

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
  const resolvedPath = useResolvedPath('')
  const fullPath = resolvedPath.pathname
  const relativePath = fullPath.split('/pulls')[0] // Adjust the slice parameters as needed

  return (
    <div className="inline-flex max-w-full items-center gap-1.5 pl-[22px] text-14 leading-none text-foreground-4">
      <p>
        {`#${number}`} opened {timestamp} by {author}
      </p>

      <span className="pointer-events-none h-2.5 w-px bg-borders-2" aria-hidden />

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
      <span className="pointer-events-none h-2.5 w-px bg-borders-2" aria-hidden />

      {sourceBranch && (
        <>
          <Button variant="secondary" size="xs" asChild>
            <Link to={`${relativePath}/code/${targetBranch}`}>
              <Icon name="branch" size={11} className="mr-1 text-tertiary-background" />
              <Text size={1} className="p-0.5 hover:underline">
                {targetBranch}
              </Text>
            </Link>
          </Button>

          <span>&larr;</span>
          <Button variant="secondary" size="xs" asChild>
            <Link to={`${relativePath}/code/${sourceBranch}`}>
              <Text size={1} className="p-0.5 hover:underline">
                {sourceBranch}
              </Text>
            </Link>
          </Button>
        </>
      )}
    </div>
  )
}
