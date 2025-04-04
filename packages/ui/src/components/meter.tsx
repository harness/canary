import { cn } from '@utils/cn'

export enum MeterState {
  Empty = 0,
  Error = 1,
  Warning = 2,
  Success = 3
}

interface IMeterProps {
  data?: {
    id?: string
    state: MeterState
  }[]
  className?: string
}

const stateToBgColor: { [key in MeterState]: string } = {
  [MeterState.Empty]: 'bg-cn-background-1/20',
  [MeterState.Error]: 'bg-error',
  [MeterState.Warning]: 'bg-warning',
  [MeterState.Success]: 'bg-success'
}

function Meter({ data = [], className }: IMeterProps) {
  const emptyBarsCount = 11 - data.length
  const bars: IMeterProps['data'] = [...Array(emptyBarsCount).fill({ state: MeterState.Empty }), ...data]

  return (
    <div className={cn('flex h-[19px] items-stretch gap-[4px]', className)}>
      {bars.map(col => {
        const bgColor = stateToBgColor[col.state as MeterState]
        return <div key={col.id} className={cn('flex h-full w-[5px] rounded-[1px]', bgColor)} />
      })}
    </div>
  )
}

export { Meter }
