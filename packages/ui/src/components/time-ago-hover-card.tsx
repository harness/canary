import { timeAgo } from '../utils/utils'
import { Button } from './button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'

export const TimeAgoHoverCard = ({ timeStamp }: { timeStamp: number }) => {
  const utcFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
    timeZoneName: 'short'
  })

  const localFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  })
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent">
          {timeAgo(timeStamp)}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-3 space-y-1 text-sm" avoidCollisions={true}>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">UTC:</span>
          <span>{utcFormatter.format(timeStamp)}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-muted-foreground">Local:</span>
          <span className="text-left">{localFormatter.format(timeStamp)}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
