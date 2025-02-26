import { NodeMenuTrigger } from '@subjects/views/pipeline-edit/pipeline-nodes/components/node-menu-trigger.tsx'
import { NodeTitle } from '@subjects/views/pipeline-edit/pipeline-nodes/components/node-title.tsx'
import { getNestedStepsCount } from '@subjects/views/pipeline-edit/utils/common-step-utils'

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
  hideContextMenu?: boolean
  hideFloatingButtons?: boolean
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
    onAddClick,
    hideContextMenu,
    hideFloatingButtons
  } = props

  const nodeData = node.data
  const counter = getNestedStepsCount(node.children)

  return (
    <>
      <ExecutionStatus nodeData={nodeData} />

      <div
        className={cn('absolute inset-0 -z-10 rounded-md border bg-graph-background-1', {
          'border-borders-4': !selected,
          'border-borders-3': selected,
          'bg-background-2 border-borders-2': collapsed
        })}
      />

      <NodeTitle name={name} onHeaderClick={onHeaderClick} counter={counter} />

      {!hideContextMenu && <NodeMenuTrigger onEllipsisClick={onEllipsisClick} />}

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

      {!hideFloatingButtons && isFirst && (
        <FloatingAddButton
          parentNodeType={parentNodeType}
          position="before"
          onClick={e => {
            onAddClick?.('before', e)
          }}
          collapsed={collapsed}
        />
      )}
      {!hideFloatingButtons && (
        <FloatingAddButton
          parentNodeType={parentNodeType}
          position="after"
          onClick={e => {
            onAddClick?.('after', e)
          }}
          collapsed={collapsed}
        />
      )}
      {collapsed ? <CollapsedGroupNode node={node} containerNodeType={'parallel'} /> : children}
    </>
  )
}
