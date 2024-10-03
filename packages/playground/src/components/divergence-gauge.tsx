import React from 'react'
import { Progress, Text } from '@harnessio/canary'
import { cn } from '@harnessio/canary'

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
    <div className={cn('flex gap-1 flex-col w-full mt-0.5', className)}>
      <div className="grid gap-x-2 grid-flow-col grid-cols-[1fr_auto_1fr] justify-items-end items-center w-28 mx-auto">
        <Text as="p" size={1} truncate color="tertiaryBackground" className="leading-none">
          {behindAhead.behind ?? 0}
        </Text>
        <div className="border-r border-tertiary-background/30 h-full" />
        <Text as="p" size={1} truncate color="tertiaryBackground" className="place-self-start leading-none">
          {behindAhead.ahead ?? 0}
        </Text>
      </div>
      {/* Both behind and ahead are 0, don't show the progress bar */}
      {behindAhead.behind === 0 && behindAhead.ahead == 0 ? null : (
        <div className="grid grid-flow-col grid-cols-2 justify-center items-center w-28 mx-auto">
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
