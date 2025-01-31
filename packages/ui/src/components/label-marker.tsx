import { FC } from 'react'

import { ColorsEnum } from '@/views'
import { cn } from '@utils/cn'

export interface LabelMarkerProps {
  label: string
  value?: string | number
  color: ColorsEnum
  inTable?: boolean
}

export const LabelMarkerColor = {
  [ColorsEnum.RED]: 'bg-label-background-red text-label-foreground-red',
  [ColorsEnum.BLUE]: 'bg-label-background-blue text-label-foreground-blue',
  [ColorsEnum.GREEN]: 'bg-label-background-green text-label-foreground-green',
  [ColorsEnum.YELLOW]: 'bg-label-background-yellow text-label-foreground-yellow',
  [ColorsEnum.PURPLE]: 'bg-label-background-purple text-label-foreground-purple',
  [ColorsEnum.PINK]: 'bg-label-background-pink text-label-foreground-pink',
  [ColorsEnum.VIOLET]: 'bg-label-background-violet text-label-foreground-violet',
  [ColorsEnum.INDIGO]: 'bg-label-background-indigo text-label-foreground-indigo',
  [ColorsEnum.CYAN]: 'bg-label-background-cyan text-label-foreground-cyan',
  [ColorsEnum.ORANGE]: 'bg-label-background-orange text-label-foreground-orange',
  [ColorsEnum.BROWN]: 'bg-label-background-brown text-label-foreground-brown',
  [ColorsEnum.MINT]: 'bg-label-background-mint text-label-foreground-mint',
  [ColorsEnum.LIME]: 'bg-label-background-lime text-label-foreground-lime'
}

export const LabelMarker: FC<LabelMarkerProps> = ({ label, value, color, inTable = false }) => {
  return (
    <span
      className={cn(
        `inline-flex text-12 h-5 py-px px-2 items-center font-medium rounded overflow-hidden max-w-full ${LabelMarkerColor[color]}`,
        { 'pr-px': !!value }
      )}
    >
      <span className={cn('truncate', { 'flex-1': inTable }, { 'pr-1.5': !!value })}>{label}</span>
      {!!value && (
        <span
          className={`flex h-full items-center overflow-hidden rounded-r bg-label-background-black pl-1.5 pr-[7px] ${inTable && 'max-w-[50%]'}`}
        >
          <span className="max-w-full truncate">{value}</span>
        </span>
      )}
    </span>
  )
}
