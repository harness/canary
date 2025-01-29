import { FC } from 'react'

import { Badge, Icon } from '@/components'
import * as StackedList from '@/components/stacked-list'
import { cn } from '@utils/cn'

import { getPrState } from '../utils'

const colorMapping: { [key: string]: { border: string; text: string; bg: string } } = {
  mint: { border: 'border-tag-border-mint-1', text: 'text-tag-foreground-mint-1', bg: 'bg-tag-background-mint-1' },
  yellow: { border: 'border-tag-border-amber-1', text: 'text-tag-foreground-amber-1', bg: 'bg-tag-background-amber-1' },
  red: { border: 'border-tag-border-red-1', text: 'text-tag-foreground-red-1', bg: 'bg-tag-background-red-1' },
  blue: { border: 'border-tag-border-blue-1', text: 'text-tag-foreground-blue-1', bg: 'bg-tag-background-blue-1' },
  purple: {
    border: 'border-tag-border-purple-1',
    text: 'text-tag-foreground-purple-1',
    bg: 'bg-tag-background-purple-1'
  }
}

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
  labels: { text: string; color: string }[]
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
        {labels?.map((l, l_idx) => {
          const { border, text, bg } = colorMapping[l.color]
            ? colorMapping[l.color]
            : { border: 'tertiary-foreground', text: 'tertiary-foreground/20', bg: 'bg-tertiary-background' }
          return (
            <Badge
              key={`${l_idx}-${l.text}`}
              variant="outline"
              size="sm"
              borderRadius="full"
              className={cn(border, text, bg)}
            >
              <p className="max-w-[376px] truncate">{l.text}</p>
            </Badge>
          )
        })}
      </div>
      {!!comments && <StackedList.Field title={<Comments comments={comments} />} right label secondary />}
    </div>
  )
}
