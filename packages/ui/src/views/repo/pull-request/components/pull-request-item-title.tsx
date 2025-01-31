import { FC } from 'react'

import { Icon } from '@/components'
import * as StackedList from '@/components/stacked-list'
import { LabelAssignmentType } from '@/views'
import { cn } from '@utils/cn'

import { getPrState } from '../utils'
import { LabelsList } from './pull-request-labels-list'

const Comments = ({ comments }: { comments: number }) => {
  return (
    <div className="flex items-center gap-1">
      <Icon className="text-icons-7" size={16} name="comments" />
      <span className="text-12 text-foreground-1 leading-none">{comments}</span>
    </div>
  )
}

interface PullRequestItemTitleProps {
  merged?: number | null
  isDraft?: boolean
  state?: string
  success: boolean
  title: string
  comments?: number
  labels: LabelAssignmentType[]
}

export const PullRequestItemTitle: FC<PullRequestItemTitleProps> = ({
  success,
  title,
  labels,
  state,
  isDraft,
  comments,
  merged
}) => {
  console.log(labels)

  return (
    <div className="flex max-w-full items-center gap-2">
      <div className="flex max-w-full flex-wrap items-center justify-start gap-1.5">
        <Icon
          size={14}
          className={cn({
            'text-icons-success': state === 'open' && !isDraft,
            'text-icons-1': state === 'open' && isDraft,
            'text-icons-danger': state === 'closed',
            'text-icons-merged': success
          })}
          name={getPrState(isDraft, merged, state).icon}
        />

        <p className="text-16 ml-0.5 mr-1 max-w-[95%] truncate font-medium leading-snug ">{title}</p>
        {labels.length > 0 && <LabelsList labels={labels} />}
      </div>
      {!!comments && <StackedList.Field title={<Comments comments={comments} />} right label secondary />}
    </div>
  )
}
