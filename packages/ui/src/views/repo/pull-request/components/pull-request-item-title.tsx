import { FC } from 'react'

import { Icon, StackedList } from '@/components'
import { PRListLabelType } from '@/views'
import { cn } from '@utils/cn'
import { LabelsList } from '@views/repo/pull-request/components/labels'

import { getPrState } from '../utils'

const Comments = ({ comments }: { comments: number }) => {
  return (
    <div className="flex items-center gap-1">
      <Icon className="text-icons-7" size={16} name="comments" />
      <span className="text-12 leading-none text-foreground-1">{comments}</span>
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
  labels: PRListLabelType[]
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

        <p className="ml-0.5 mr-1 max-w-[95%] truncate text-16 font-medium leading-snug ">{title}</p>
        {!!labels.length && <LabelsList labels={labels} />}
      </div>
      {!!comments && <StackedList.Field title={<Comments comments={comments} />} right label secondary />}
    </div>
  )
}
