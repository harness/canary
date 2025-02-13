import { Badge } from './badge'
import { Button } from './button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'

export const TimeAgoHoverCard = ({ formattedDate, timeStamp }: { formattedDate: string; timeStamp: number }) => {
  const utcFormatterYear = new Intl.DateTimeFormat(undefined, {
    // weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
    // timeZoneName: 'short'
  })

  const utcFormatterTime = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC'
  })

  const localFormatterYear = new Intl.DateTimeFormat(undefined, {
    // weekday: 'short',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    hour12: false
    // timeZoneName: 'short'
  })

  const localFormatterTime = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="hover:bg-transparent px-0">
          {formattedDate}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3 space-y-1 text-sm" avoidCollisions={true}>
        <div className="flex gap-2">
          {/* <span className="font-medium text-muted-foreground">UTC:</span> */}
          <Badge variant="tertiary" size="sm" borderRadius="base">
            UTC
          </Badge>
          <span className="text-left">{utcFormatterYear.format(timeStamp)}</span>
          <span className="text-right">{utcFormatterTime.format(timeStamp)}</span>
        </div>
        <div className="flex gap-2">
          <Badge variant="tertiary" size="sm" borderRadius="base">
            Local
          </Badge>
          <span className="text-left">{localFormatterYear.format(timeStamp)}</span>
          <span className="text-right">{localFormatterTime.format(timeStamp)}</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
