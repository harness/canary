import { cn } from '@utils/cn'

import './step-node.css'

import { ParallelContainerConfigType, SerialContainerConfigType } from '@harnessio/pipeline-graph'

import { ExecutionStatus } from './components/execution-status'
import { FloatingAddButton } from './components/floating-add-button'
import { NodeMenuTrigger } from './components/node-menu-trigger'
import { WarningLabel } from './components/warning-label'
import { ExecutionStatusType } from './types/types'

export interface StepNodeProps {
  name?: string
  executionStatus?: ExecutionStatusType
  warningMessage?: string
  icon?: React.ReactNode
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  hideContextMenu?: boolean
  hideFloatingButtons?: boolean
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  counter?: number
  isCollapsedNode?: boolean
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  serialContainerConfig?: Partial<SerialContainerConfigType>
}

export function StepNode(props: StepNodeProps) {
  const {
    name,
    executionStatus,
    warningMessage,
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
    hideFloatingButtons,
    parallelContainerConfig,
    serialContainerConfig
  } = props

  return (
    <>
      <ExecutionStatus executionStatus={executionStatus} />

      <div
        className={cn('bg-background-8 rounded-md', {
          'unified-pipeline-studio_card-wrapper ': executionStatus === 'executing'
        })}
      >
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'flex flex-col justify-end gap-y-2 box size-full rounded-md border bg-graph-gradient-1 cursor-pointer p-2.5 pt-2 shadow-1',
            {
              'border-graph-border-1': !selected,
              'border-borders-3': selected,
              'border-borders-success': executionStatus === 'success',
              'border-borders-alert': executionStatus === 'warning',
              'border-borders-danger': executionStatus === 'error',
              'border-0': executionStatus === 'executing'
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
              parallelContainerConfig={parallelContainerConfig}
              serialContainerConfig={serialContainerConfig}
            />
          )}
          {!hideFloatingButtons && !isCollapsedNode && (
            <FloatingAddButton
              parentNodeType={parentNodeType}
              position="after"
              onClick={e => {
                onAddClick?.('after', e)
              }}
              parallelContainerConfig={parallelContainerConfig}
              serialContainerConfig={serialContainerConfig}
            />
          )}
          {icon}
          <span className="line-clamp-2 text-14 font-medium leading-snug text-foreground-1">
            {name}
            {!!counter && <span className="font-normal text-foreground-4"> ({counter})</span>}
          </span>
          {warningMessage && <WarningLabel>{warningMessage}</WarningLabel>}
        </div>
      </div>
    </>
  )
}
