// import { cn, Progress, Text } from '@harnessio/canary'

import { Progress, Text } from '@/components'
import { cn } from '@/utils/cn'

interface GaugeProps {
  behindAhead: {
    behind?: number
    ahead?: number
  }
  className?: string
}

export const DivergenceGauge = ({ behindAhead, className }: GaugeProps) => {
  const total = (behindAhead.behind ?? 0) + (behindAhead.ahead ?? 0)
  const getPercentage = (value: number) => (total > 0 ? (value / total) * 100 : 0)
  const behindPercentage = getPercentage(behindAhead.behind ?? 0)
  const aheadPercentage = getPercentage(behindAhead.ahead ?? 0)

  return (
    <div className={cn('mt-0.5 flex w-full flex-col gap-1', className)}>
      <div className="mx-auto grid w-28 grid-flow-col grid-cols-[1fr_auto_1fr] items-center justify-items-end gap-x-2">
        <Text as="p" size={1} truncate color="tertiaryBackground" className="leading-none">
          {behindAhead.behind ?? 0}
        </Text>
        <div className="h-full border-r border-tertiary-background/30" />
        <Text as="p" size={1} truncate color="tertiaryBackground" className="place-self-start leading-none">
          {behindAhead.ahead ?? 0}
        </Text>
      </div>
      {/* Both behind and ahead are 0, don't show the progress bar */}
      {behindAhead?.behind === 0 && behindAhead?.ahead == 0 ? null : (
        <div className="mx-auto grid w-28 grid-flow-col grid-cols-2 items-center justify-center">
          <Progress
            variant="divergence"
            value={behindPercentage}
            rotated="180deg"
            indicatorRounded="right-sm"
            indicatorColor="tertiary-background-20"
          />
          <Progress
            variant="divergence"
            value={aheadPercentage}
            indicatorRounded="right-sm"
            indicatorColor="tertiary-background-40"
          />
        </div>
      )}
    </div>
  )
}
