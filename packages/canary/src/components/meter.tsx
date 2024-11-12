import React from 'react'
import { cn } from '@/lib/utils'

export enum MeterState {
  Empty = 0,
  Error = 1,
  Warning = 2,
  Success = 3
}

interface MeterRootProps {
  data?: {
    id?: string
    state: MeterState
  }[]
  className?: string
}

const stateToBgColor: { [key in MeterState]: string } = {
  [MeterState.Empty]: 'bg-tertiary-background/20',
  [MeterState.Error]: 'bg-error',
  [MeterState.Warning]: 'bg-warning',
  [MeterState.Success]: 'bg-success'
}

function Root({ data = [], className }: MeterRootProps) {
  const emptyBarsCount = 11 - data.length
  const bars = [...Array(emptyBarsCount).fill({ state: MeterState.Empty }), ...data]

  return (
    <div className={cn('flex h-[19px] gap-[4px] items-stretch', className)}>
      {bars.map((col, col_idx) => {
        const bgColor = stateToBgColor[col.state as MeterState]
        return <div key={col_idx} className={cn('flex w-[5px] h-full rounded-[1px]', bgColor)} />
      })}
    </div>
  )
}

export { Root }
