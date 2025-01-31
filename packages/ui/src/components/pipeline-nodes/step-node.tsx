import { cn } from '@utils/cn'

import { Button, Icon, Text } from '..'
import { FloatingAddButton } from './components/floating-add-button'

export interface StepNodeProps {
  name?: string
  icon?: React.ReactNode
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function StepNode(props: StepNodeProps) {
  const { name, icon, selected, onEllipsisClick, onClick, onAddClick, isFirst, parentNodeType } = props

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn('box-border size-full rounded-xl border bg-primary-foreground cursor-pointer', {
        'border-borders-2': !selected,
        'border-borders-3': selected
      })}
      onClick={onClick}
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

      {isFirst && (
        <FloatingAddButton
          parentNodeType={parentNodeType}
          position="before"
          onClick={e => {
            onAddClick?.('before', e)
          }}
        />
      )}
      <FloatingAddButton
        parentNodeType={parentNodeType}
        position="after"
        onClick={e => {
          onAddClick?.('after', e)
        }}
      />

      {/* position="left" */}
      <div>{icon}</div>
      <Text title={name} className="m-2 line-clamp-2 text-primary">
        {name}
      </Text>
    </div>
  )
}
