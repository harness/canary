import { cn } from '@utils/cn'

import './step-node.css'

import { Text } from '@components/text'

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
        className={cn('bg-cn-gray-secondary rounded-3', {
          'unified-pipeline-studio_card-wrapper ': executionStatus === 'executing'
        })}
      >
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'flex flex-col justify-end gap-y-cn-xs box size-full rounded-3 border bg-cn-graph-card-gradient cursor-pointer p-cn-xs shadow-4',
            {
              'border-cn-2': !selected,
              'border-cn-3': selected,
              'border-cn-success': executionStatus === 'success',
              'border-cn-warning': executionStatus === 'warning',
              'border-cn-danger': executionStatus === 'error',
              'border-transparent': executionStatus === 'executing'
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
          <Text as="span" color="foreground-1">
            {name}
            {!!counter && <Text as="span"> ({counter})</Text>}
          </Text>
          {warningMessage && <WarningLabel>{warningMessage}</WarningLabel>}
        </div>
      </div>
    </>
  )
}
