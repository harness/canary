import { SerialNodeInternalType } from '@harnessio/pipeline-graph'
import { Button, Icon } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/views'

import { CustomSerialStepGroupContentNodeDataType } from '../nodes/custom-serial-step-group-content-node'
import { CollapsedGroupNode } from './components/collapsed-group-node'
import { ExecutionStatus } from './components/execution-status'
import { FloatingAddButton } from './components/floating-add-button'

export interface SerialGroupNodeProps {
  name?: string
  children?: React.ReactElement
  collapsed?: boolean
  isEmpty?: boolean
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  node: SerialNodeInternalType<CustomSerialStepGroupContentNodeDataType>
  onEllipsisClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddInClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onHeaderClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function SerialGroupNode(props: SerialGroupNodeProps) {
  const {
    name,
    children,
    collapsed,
    isEmpty,
    selected,
    isFirst,
    onEllipsisClick,
    onAddInClick,
    onHeaderClick,
    onAddClick,
    parentNodeType,
    node
  } = props

  const nodeData = node.data

  return (
    <>
      <ExecutionStatus nodeData={nodeData} />

      <div
        className={cn('absolute inset-0 -z-10 border-dashed rounded-md border', {
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
      {collapsed ? <CollapsedGroupNode node={node} containerNodeType={'serial'} /> : children}
    </>
  )
}
