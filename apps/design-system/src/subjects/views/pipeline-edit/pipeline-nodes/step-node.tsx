import { Button, Icon, Text } from '@harnessio/ui/components'
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
      <ExecutionStatus nodeData={nodeData} align="right" />

      <div
        className={cn({
          'card-wrapper': nodeData.state === 'executing'
        })}
      >
        <div
          role="button"
          tabIndex={0}
          className={cn('box size-full rounded-md border bg-primary-foreground cursor-pointer', {
            'border-borders-2': !selected,
            'border-borders-3': selected,
            'border-success': nodeData.state === 'success',
            'card-wrapper-warning': nodeData.state === 'warning',
            'card-wrapper-error': nodeData.state === 'error'
          })}
          onClick={onClick}
        >
          {onEllipsisClick && (
            <Button
              className="absolute right-2 top-2"
              variant="ghost"
              size="sm_icon"
              onMouseDown={e => e.stopPropagation()}
              onClick={onEllipsisClick}
            >
              <Icon name="ellipsis" size={15} />
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
          <div>{icon}</div>
          <Text title={name} className="text-primary m-2 line-clamp-2">
            {name}
          </Text>
          {nodeData.warningMessage && <WarningLabel>{nodeData.warningMessage}</WarningLabel>}
        </div>
      </div>
    </>
  )
}
