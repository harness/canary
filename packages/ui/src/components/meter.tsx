import { ReactNode } from 'react'

import { cn } from '@utils/cn'

import { Tooltip, TooltipProvider } from './tooltip'

export enum MeterState {
  Empty = 0,
  Error = 1,
  Warning = 2,
  Success = 3,
  Info = 4
}

interface IMeterProps {
  data?: {
    id?: string
    state: MeterState
    tooltip?: {
      content: ReactNode
    }
  }[]
  className?: string
}

const stateToBgColor: { [key in MeterState]: string } = {
  [MeterState.Empty]: 'bg-cn-gray-secondary',
  [MeterState.Error]: 'bg-cn-danger-primary',
  [MeterState.Warning]: 'bg-cn-warning-primary',
  [MeterState.Success]: 'bg-cn-success-primary',
  [MeterState.Info]: 'bg-cn-brand-primary'
}

function Meter({ data = [], className }: IMeterProps) {
  const emptyBarsCount = 11 - data.length
  const bars: IMeterProps['data'] = [...Array(emptyBarsCount).fill({ state: MeterState.Empty }), ...data]

  return (
    <TooltipProvider skipDelayDuration={0} delayDuration={0}>
      <div className={cn('cn-meter', className)}>
        {bars.map((col, index) => {
          const bgColor = stateToBgColor[col.state as MeterState]
          const tooltip = col.tooltip
          const key = col.id || `meter-bar-${index}`

          if (tooltip) {
            return (
              <Tooltip key={key} content={tooltip.content} delay={0}>
                <div className={cn('cn-meter-bar cn-meter-tooltip-bar', bgColor)} />
              </Tooltip>
            )
          }
          return <div key={key} className={cn('cn-meter-bar', bgColor)} />
        })}
      </div>
    </TooltipProvider>
  )
}

export { Meter }
