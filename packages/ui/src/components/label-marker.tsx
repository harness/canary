import { FC } from 'react'

import { Button, Icon } from '@/components'
import { cn } from '@utils/cn'
import { ColorsEnum, ILabelType, LabelType } from '@views/labels'

export interface LabelMarkerProps {
  type?: ILabelType['type']
  color: ILabelType['color']
  label: string
  value?: string
  counter?: ILabelType['value_count']
  className?: string
  onDelete?: () => void
}

const LabelMarkerColor = {
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
const deleteButtonColor = {
  [ColorsEnum.RED]: 'text-label-foreground-red hover:opacity-60',
  [ColorsEnum.BLUE]: 'text-label-foreground-blue hover:opacity-60',
  [ColorsEnum.GREEN]: 'text-label-foreground-green hover:opacity-60',
  [ColorsEnum.YELLOW]: 'text-label-foreground-yellow hover:opacity-60',
  [ColorsEnum.PURPLE]: 'text-label-foreground-purple hover:opacity-60',
  [ColorsEnum.PINK]: 'text-label-foreground-pink hover:opacity-60',
  [ColorsEnum.VIOLET]: 'text-label-foreground-violet hover:opacity-60',
  [ColorsEnum.INDIGO]: 'text-label-foreground-indigo hover:opacity-60',
  [ColorsEnum.CYAN]: 'text-label-foreground-cyan hover:opacity-60',
  [ColorsEnum.ORANGE]: 'text-label-foreground-orange hover:opacity-60',
  [ColorsEnum.BROWN]: 'text-label-foreground-brown hover:opacity-60',
  [ColorsEnum.MINT]: 'text-label-foreground-mint hover:opacity-60',
  [ColorsEnum.LIME]: 'text-label-foreground-lime hover:opacity-60'
}

export const LabelMarker: FC<LabelMarkerProps> = ({
  type = LabelType.STATIC,
  label,
  value,
  color,
  counter,
  onDelete,
  className
}) => {
  const isDynamic = type === LabelType.DYNAMIC
  const isWithExtraContent = !!value || !!counter
  const isWithDeleteButton = !!onDelete

  return (
    <div className={cn('flex max-w-full items-center gap-2 opa relative', className)}>
      <span
        className={cn(
          `grid text-12 leading-4 h-5 py-px px-2 items-center font-medium rounded overflow-hidden w-fit ${LabelMarkerColor[color]}`,
          { 'pr-px grid-cols-[auto,auto]': isWithExtraContent },
          { 'pr-6': !isWithExtraContent && isWithDeleteButton }
        )}
      >
        <span className={cn('truncate', { 'pr-1.5': isWithExtraContent })}>{label}</span>

        {isWithExtraContent && (
          <span
            className={cn(
              `bg-label-background-black flex h-full items-center overflow-hidden rounded-r-[3px] pl-1.5 pr-[7px]`,
              { 'pr-6': isWithExtraContent && isWithDeleteButton }
            )}
          >
            {!!value && <span className="max-w-full truncate">{value}</span>}

            {!!counter && counter}
          </span>
        )}
      </span>

      {isWithDeleteButton && (
        <Button
          className={`absolute right-1 top-0.5 max-h-4 min-h-4 min-w-4 max-w-4 px-0 ${deleteButtonColor[color]}`}
          variant="custom"
          onClick={onDelete}
        >
          <Icon name="cross" size={10} />
        </Button>
      )}

      {isDynamic && <Icon name="circle-plus" size={12} className="min-w-3 text-icons-4" />}
    </div>
  )
}
