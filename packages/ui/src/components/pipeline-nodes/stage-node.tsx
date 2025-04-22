import { Button } from '@components/button'
import { Icon } from '@components/icon'
import { cn } from '@utils/cn'

import { ParallelContainerConfigType, SerialContainerConfigType } from '@harnessio/pipeline-graph'

import { ExecutionStatus } from './components/execution-status'
import { FloatingAddButton } from './components/floating-add-button'
import { NodeMenuTrigger } from './components/node-menu-trigger'
import { NodeTitle } from './components/node-title'
import { ExecutionStatusType } from './types/types'

export interface StageNodeProps {
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
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddInClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onHeaderClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  serialContainerConfig?: Partial<SerialContainerConfigType>
}

export function StageNode(props: StageNodeProps) {
  const {
    name,
    executionStatus,
    allChildrenCount,
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
    hideContextMenu,
    hideFloatingButtons,
    parallelContainerConfig,
    serialContainerConfig
  } = props

  return (
    <>
      <ExecutionStatus executionStatus={executionStatus} />

      <div
        className={cn('absolute inset-0 -z-10 rounded-md border border-dashed bg-graph-background-2', {
          'border-graph-border-1': !selected,
          'border-cn-borders-3': selected
        })}
      />

      <NodeTitle name={name} onHeaderClick={onHeaderClick} counter={allChildrenCount} />

      {!hideContextMenu && <NodeMenuTrigger onEllipsisClick={onEllipsisClick} />}

      {!collapsed && isEmpty && (
        <Button
          rounded
          className="self-center p-3"
          variant="surface"
          theme="muted"
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
