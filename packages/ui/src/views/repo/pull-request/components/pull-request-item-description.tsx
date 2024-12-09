import { FC } from 'react'

import { Icon } from '@/components'

interface PullRequestItemDescriptionProps {
  number: number
  reviewRequired?: boolean
  tasks?: number
  author: string
  sourceBranch: string
  timestamp: string
}

export const PullRequestItemDescription: FC<PullRequestItemDescriptionProps> = ({
  reviewRequired,
  number,
  tasks,
  author,
  sourceBranch,
  timestamp
}) => {
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
      {sourceBranch && (
        <div className="ml-3 flex items-center gap-0.5">
          <Icon className="text-icons-1" size={12} name="signpost" />
          <p>{sourceBranch}</p>
        </div>
      )}
    </div>
  )
}
