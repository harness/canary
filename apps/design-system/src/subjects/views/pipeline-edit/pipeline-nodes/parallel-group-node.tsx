import { Button, Icon } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/views'

import { StepNodeDataType } from '../nodes/custom-step-node'
import { FloatingAddButton } from './components/floating-add-button'

export interface ParallelGroupNodeProps {
  name?: string
  children?: React.ReactElement
  collapsed?: boolean
  isEmpty?: boolean
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  nodeData: StepNodeDataType
  onEllipsisClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddInClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onHeaderClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function ParallelGroupNode(props: ParallelGroupNodeProps) {
  const {
    name,
    children,
    collapsed,
    isEmpty,
    selected,
    isFirst,
    parentNodeType,
    onEllipsisClick,
    onAddInClick,
    onHeaderClick,
    onAddClick
  } = props

  return (
    <>
      <div
        className={cn('absolute inset-0 -z-10 rounded-xl border', {
          'border-borders-2': !selected,
          'border-borders-3': selected
        })}
      />

      <div className="absolute inset-x-0 top-0 h-0">
        <div
          role="button"
          tabIndex={0}
          title={name}
          className="text-primary-muted h-10 cursor-pointer truncate px-9 pt-2.5"
          onClick={onHeaderClick}
        >
          {name}
        </div>
      </div>

      <Button
        className="absolute right-2 top-2 z-10"
        variant="ghost"
        size="sm_icon"
        onMouseDown={e => e.stopPropagation()}
        onClick={onEllipsisClick}
      >
        <Icon name="ellipsis" size={15} />
      </Button>

      {!collapsed && isEmpty && (
        <Button
          className="self-center rounded-full p-3"
          variant="outline"
          size="lg"
          onMouseDown={e => e.stopPropagation()}
          onClick={onAddInClick}
        >
          <Icon name="plus" size={15} />
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

      {children}
    </>
  )
}
