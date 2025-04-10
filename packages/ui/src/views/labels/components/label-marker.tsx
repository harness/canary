import { FC } from 'react'

import { Button, Icon } from '@/components'
import { cn } from '@utils/cn'
import { ILabelType, LabelType } from '@views/labels'

export interface LabelMarkerProps {
  type?: ILabelType['type']
  color: ILabelType['color']
  label: string
  value?: string
  counter?: ILabelType['value_count']
  className?: string
  onDelete?: () => void
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
  const hasExtraContent = !!value || !!counter
  const hasDeleteButton = !!onDelete

  return (
    <div className={cn('flex max-w-full items-center gap-2 opa relative', className)}>
      <div
        className={cn(
          `grid text-12 leading-4 h-5 py-px px-2 items-center font-medium rounded overflow-hidden w-fit bg-label-background-${color} text-label-foreground-${color}`,
          { 'pr-px grid-cols-[auto,auto]': hasExtraContent },
          { 'pr-6': !hasExtraContent && hasDeleteButton }
        )}
      >
        <span className={cn('truncate', { 'pr-1.5': hasExtraContent })}>{label}</span>

        {hasExtraContent && (
          <div
            className={cn(
              `bg-label-background-cover flex h-full items-center overflow-hidden rounded-r-[3px] pl-1.5 pr-[7px]`,
              { 'pr-6': hasExtraContent && hasDeleteButton }
            )}
          >
            {!!value && <span className="max-w-full truncate">{value}</span>}

            {!!counter && counter}
          </div>
        )}
      </div>

      {hasDeleteButton && (
        <Button
          aria-label="Delete label"
          className={cn(
            `absolute right-1 top-0.5 max-h-4 min-h-4 min-w-4 max-w-4 px-0 text-label-foreground-${color} hover:opacity-60`
          )}
          variant="custom"
          onClick={onDelete}
        >
          <Icon name="cross" size={10} />
        </Button>
      )}

      {isDynamic && <Icon name="circle-plus" size={12} className="min-w-3 text-icons-4" role="presentation" />}
    </div>
  )
}
