import { cn } from '@utils/cn'

import { ParallelContainerConfigType, SerialContainerConfigType } from '@harnessio/pipeline-graph'

import { IconV2 } from '..'
import { ExecutionStatus } from './components/execution-status'
import { FloatingAddButton } from './components/floating-add-button'
import { NodeMenuTrigger } from './components/node-menu-trigger'
import { WarningLabel } from './components/warning-label'
import { ExecutionStatusType } from './types/types'

export interface SplitView_StageNodeProps {
  name?: string
  executionStatus?: ExecutionStatusType
  warningMessage?: string
  icon?: React.ReactNode
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
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  counter?: number
  isCollapsedNode?: boolean
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  serialContainerConfig?: Partial<SerialContainerConfigType>
}

export function SplitView_StageNode(props: SplitView_StageNodeProps) {
  const {
    name,
    executionStatus,
    warningMessage,
    selected,
    isFirst,
    onEllipsisClick,
    onClick,
    onAddClick,
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
        className={cn('bg-cn-background-softgray rounded-md', {
          'unified-pipeline-studio_card-wrapper ': executionStatus === 'executing'
        })}
      >
        <div
          role="button"
          tabIndex={0}
          className={cn(
            'flex flex-col justify-end gap-y-2 box size-full rounded-md border bg-graph-gradient-1 cursor-pointer p-2.5 pt-2 shadow-4',
            {
              'border-graph-border-1': !selected,
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
          {/* {icon} */}
          <IconV2 name="square-dashed" size="md" />
          <span className="line-clamp-2 text-2 font-medium leading-snug text-cn-foreground-1">
            {name}
            {!!counter && <span className="font-normal text-cn-foreground-2"> ({counter})</span>}
          </span>
          {warningMessage && <WarningLabel>{warningMessage}</WarningLabel>}
        </div>
      </div>
    </>
  )
}
