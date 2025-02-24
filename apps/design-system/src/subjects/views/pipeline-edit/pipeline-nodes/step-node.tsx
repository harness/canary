import { cn } from '@harnessio/ui/views'

import './step-node.css'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { StepNodeDataType } from '../nodes/custom-step-node'
import { ExecutionStatus } from './components/execution-status'
import { FloatingAddButton } from './components/floating-add-button'
import { NodeMenuTrigger } from './components/node-menu-trigger'
import { WarningLabel } from './components/warning-label'

export interface StepNodeProps {
  name?: string
  icon?: React.ReactNode
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  node: LeafNodeInternalType<StepNodeDataType>
  hideContextMenu?: boolean
  hideFloatingButtons?: boolean
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  counter?: number
  isCollapsedNode?: boolean
}

export function StepNode(props: StepNodeProps) {
  const {
    node,
    name,
    icon,
    selected,
    onEllipsisClick,
    onClick,
    onAddClick,
    isFirst,
    parentNodeType,
    counter,
    isCollapsedNode,
    hideContextMenu,
    hideFloatingButtons
  } = props

  const nodeData = node.data

  return (
    <>
      <ExecutionStatus nodeData={nodeData} />

      <div
        className={cn('w-[200px]', {
          'card-wrapper': nodeData.state === 'executing'
        })}
      >
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'flex flex-col justify-end gap-y-2 box size-full rounded-md border bg-graph-gradient-1 cursor-pointer px-2.5 pt-2.5 pb-3 shadow-1',
            {
              'border-borders-2': !selected,
              'border-borders-3': selected,
              'border-borders-success': nodeData.state === 'success',
              'border-borders-alert': nodeData.state === 'warning',
              'border-borders-danger': nodeData.state === 'error',
              'border-0': nodeData.state === 'executing'
            }
          )}
          onClick={onClick}
        >
          {!hideContextMenu && <NodeMenuTrigger onEllipsisClick={onEllipsisClick} />}

          {!hideFloatingButtons && isFirst && !isCollapsedNode && (
            <FloatingAddButton
              parentNodeType={parentNodeType}
              position="before"
              onClick={e => {
                onAddClick?.('before', e)
              }}
            />
          )}
          {!hideFloatingButtons && !isCollapsedNode && (
            <FloatingAddButton
              parentNodeType={parentNodeType}
              position="after"
              onClick={e => {
                onAddClick?.('after', e)
              }}
            />
          )}
          {!!icon && <div className="mb-0.5">{icon}</div>}
          <span className="text-foreground-1 text-14 line-clamp-2 leading-snug">
            {name}
            {!!counter && <span className="text-foreground-5"> ({counter})</span>}
          </span>
          {nodeData.warningMessage && <WarningLabel>{nodeData.warningMessage}</WarningLabel>}
        </div>
      </div>
    </>
  )
}
