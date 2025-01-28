import { cn } from '@utils/cn'

import { Button, Icon, Text } from '..'

export interface StepNodeProps {
  name?: string
  icon?: React.ReactNode
  selected?: boolean
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function StepNode(props: StepNodeProps) {
  const { name, icon, selected, onEllipsisClick } = props

  return (
    <div
      className={cn('box-border size-full rounded-xl border bg-primary-foreground', {
        'border-borders-2': !selected,
        'border-borders-3': selected
      })}
    >
      {onEllipsisClick && (
        <Button
          className="absolute right-2 top-2"
          variant="ghost"
          size="sm_icon"
          onMouseDown={e => e.stopPropagation()}
          onClick={onEllipsisClick}
        >
          <Icon name="ellipsis" size={15} />
        </Button>
      )}

      <div>{icon}</div>
      <Text title={name} className="m-2 line-clamp-2 cursor-default text-primary">
        {name}
      </Text>
    </div>
  )
}
