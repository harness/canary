import { ParallelNodeInternalType } from '@harnessio/pipeline-graph'
import { Button, Icon } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/views'

import { CustomParallelStepGroupContentNodeDataType } from '../nodes/custom-parallel-step-group-content-node'
import { CollapsedGroupNode } from './components/collapsed-group-node'
import { ExecutionStatus } from './components/execution-status'
import { FloatingAddButton } from './components/floating-add-button'

export interface ParallelGroupNodeProps {
  name?: string
  children?: React.ReactElement
  collapsed?: boolean
  isEmpty?: boolean
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  node: ParallelNodeInternalType<CustomParallelStepGroupContentNodeDataType>
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
    node,
    onEllipsisClick,
    onAddInClick,
    onHeaderClick,
    onAddClick
  } = props

  const nodeData = node.data

  // console.log(name)

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
        <Icon className="text-icons-2" name="more-dots-fill" size={12} />
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
      {collapsed ? <CollapsedGroupNode node={node} containerNodeType={'parallel'} /> : children}
    </>
  )
}
