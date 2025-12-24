import { ReactNode } from 'react'

import { cn } from '@utils/cn'

import { Popover } from './popover'

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
  const emptyBarsCount = 10 - data.length
  const bars: IMeterProps['data'] = [...Array(emptyBarsCount).fill({ state: MeterState.Empty }), ...data]

  return (
    <div className={cn('cn-meter', className)}>
      {bars.map((col, index) => {
        const bgColor = stateToBgColor[col.state as MeterState]
        const tooltip = col.tooltip
        const key = col.id || `meter-bar-${index}`

        if (tooltip) {
          return (
            <div className="flex" key={key}>
              <Popover
                triggerType="hover"
                hoverDelay={150}
                closeDelay={0}
                content={tooltip.content}
                side="top"
                align="center"
                onOpenAutoFocus={e => e.preventDefault()}
              >
                <div className={cn('cn-meter-bar cn-meter-tooltip-bar', bgColor)} />
              </Popover>
            </div>
          )
        }
        return <div key={key} className={cn('cn-meter-bar', bgColor)} />
      })}
    </div>
  )
}

export { Meter }
