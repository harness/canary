import { Button } from '@components/button'
import { IconV2 } from '@components/icon-v2'
import { cn } from '@utils/cn'

import { ParallelContainerConfigType, SerialContainerConfigType } from '@harnessio/pipeline-graph'

import { ExecutionStatus } from './components/execution-status'
import { FloatingAddButton } from './components/floating-add-button'
import { NodeMenuTrigger } from './components/node-menu-trigger'
import { NodeTitle } from './components/node-title'
import { ExecutionStatusType } from './types/types'

export interface ParallelGroupNodeProps {
  name?: string
  executionStatus?: ExecutionStatusType
  allChildrenCount?: number
  children?: React.ReactElement
  collapsed?: boolean
  isEmpty?: boolean
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  hideContextMenu?: boolean
  hideFloatingButtons?: boolean
  onEllipsisClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddInClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onHeaderClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  serialContainerConfig?: Partial<SerialContainerConfigType>
}

export function ParallelGroupNode(props: ParallelGroupNodeProps) {
  const {
    name,
    allChildrenCount,
    executionStatus,
    children,
    collapsed,
    isEmpty,
    selected,
    isFirst,
    parentNodeType,
    onEllipsisClick,
    onAddInClick,
    onHeaderClick,
    onAddClick,
    hideContextMenu,
    hideFloatingButtons,
    serialContainerConfig,
    parallelContainerConfig
  } = props

  return (
    <>
      <ExecutionStatus executionStatus={executionStatus} />

      <div
        className={cn('absolute inset-0 -z-10 rounded-3 border bg-graph-background-1', {
          'border-cn-3': !selected,
          'border-cn-2': selected,
          'bg-graph-background-2 border-graph-border-1': collapsed
        })}
      />

      <NodeTitle name={name} onHeaderClick={onHeaderClick} counter={allChildrenCount} />

      {!hideContextMenu && <NodeMenuTrigger onEllipsisClick={onEllipsisClick} />}

      {!collapsed && isEmpty && (
        <Button
          rounded
          className="self-center p-cn-sm"
          variant="outline"
          onMouseDown={e => e.stopPropagation()}
          onClick={onAddInClick}
        >
          <IconV2 name="plus" />
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
          parallelContainerConfig={parallelContainerConfig}
          serialContainerConfig={serialContainerConfig}
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
          parallelContainerConfig={parallelContainerConfig}
          serialContainerConfig={serialContainerConfig}
        />
      )}
      {children}
    </>
  )
}
