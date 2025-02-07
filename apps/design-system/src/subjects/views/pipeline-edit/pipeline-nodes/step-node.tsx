import { Button, Icon } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/views'

import './step-node.css'

import { LeafNodeInternalType } from '@harnessio/pipeline-graph'

import { StepNodeDataType } from '../nodes/custom-step-node'
import { ExecutionStatus } from './components/execution-status'
// import { createRoundedRectPath } from '../utils/utils'
import { FloatingAddButton } from './components/floating-add-button'
import { WarningLabel } from './components/warning-label'

export interface StepNodeProps {
  name?: string
  icon?: React.ReactNode
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  node: LeafNodeInternalType<StepNodeDataType>
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function StepNode(props: StepNodeProps) {
  const { node, name, icon, selected, onEllipsisClick, onClick, onAddClick, isFirst, parentNodeType } = props

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
            'flex flex-col justify-end gap-y-2 box size-full rounded-md border bg-background-8 cursor-pointer px-2.5 pt-2.5 pb-3 shadow-1',
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
          <div className="bg-graph-gradient-1 pointer-events-none absolute left-0 top-0 size-full" />
          {onEllipsisClick && (
            <Button
              className="absolute right-2 top-2"
              variant="ghost"
              size="sm_icon"
              onMouseDown={e => e.stopPropagation()}
              onClick={onEllipsisClick}
            >
              <Icon className="text-icons-2" name="more-dots-fill" size={12} />
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
          {!!icon && <div className="mb-0.5">{icon}</div>}
          <span className="text-foreground-1 text-14 line-clamp-2 leading-snug">{name}</span>
          {nodeData.warningMessage && <WarningLabel>{nodeData.warningMessage}</WarningLabel>}
        </div>
      </div>
    </>
  )
}
