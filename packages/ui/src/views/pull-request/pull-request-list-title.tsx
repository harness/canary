import { cn } from '@utils/cn'

import { Badge } from '../../components/badge'
import { Icon } from '../../components/icon'
import * as StackedList from '../../components/stacked-list'
import { Text } from '../../components/text'
import { getPrState } from './utils'

const colorMapping: { [key: string]: { border: string; text: string; bg: string } } = {
  mint: { border: 'border-emerald-400/20', text: 'text-emerald-300', bg: 'bg-emerald-400/10' },
  yellow: { border: 'border-orange-400/20', text: 'text-orange-400', bg: 'bg-orange-400/10' },
  red: { border: 'border-red-400/20', text: 'text-red-400', bg: 'bg-red-400/10' },
  blue: { border: 'border-blue-400/20', text: 'text-blue-300', bg: 'bg-blue-400/10' },
  purple: { border: 'border-purple-400/20', text: 'text-purple-300', bg: 'bg-purple-400/10' }
}

const Comments = ({ comments }: { comments: number }) => {
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={16} name="comments" />
      <Text size={1} className="text-primary">
        {comments}
      </Text>
    </div>
  )
}

export const PullRequestListTitle = ({
  success,
  title,
  labels,
  state,
  isDraft,
  comments,
  merged
}: {
  merged?: number | null
  isDraft?: boolean
  state?: string
  success: boolean
  title: string
  comments?: number
  labels: { text: string; color: string }[]
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap justify-start gap-2">
        <Icon
          size={16}
          className={cn({
            'text-success': state === 'open' && !isDraft,
            'text-tertiary-background': state === 'open' && isDraft,
            'text-ai': success
          })}
          name={getPrState(isDraft, merged, state).icon}
        />

        <Text size={2} truncate>
          {title}
        </Text>

        {labels.map((l, l_idx) => {
          const { border, text, bg } = colorMapping[l.color]
            ? colorMapping[l.color]
            : { border: 'tertiary-foreground', text: 'tertiary-foreground/20' }
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
      {comments && <StackedList.Field title={<Comments comments={comments} />} right label secondary />}
    </div>
  )
}
