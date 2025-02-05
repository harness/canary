import { Badge, Button, Icon, Text } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/views'

import './step-node.css'

import { StepNodeDataType } from '../nodes/custom-step-node'
// import { createRoundedRectPath } from '../utils/utils'
import { FloatingAddButton } from './components/floating-add-button'

export interface StepNodeProps {
  name?: string
  icon?: React.ReactNode
  selected?: boolean
  isFirst?: boolean
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  nodeData: StepNodeDataType
  onEllipsisClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  onAddClick?: (position: 'before' | 'after', e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function StepNode(props: StepNodeProps) {
  const { nodeData, name, icon, selected, onEllipsisClick, onClick, onAddClick, isFirst, parentNodeType } = props

  return (
    <>
      {nodeData.state === 'executing' ? (
        <div style={{ position: 'absolute', top: '-23px', left: '60px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="muted">
            <Icon name="running" size={12} className="mr-1 animate-spin" />
            Running
          </Badge>
        </div>
      ) : nodeData.state === 'success' ? (
        <div style={{ position: 'absolute', top: '-23px', left: '50px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme={'success'}>
            <Icon name="tick" size={12} className="mr-1" />
            Completed
          </Badge>
        </div>
      ) : nodeData.state === 'warning' ? (
        <div style={{ position: 'absolute', top: '-23px', left: '60px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="warning">
            <Icon name="triangle-warning" size={12} className="mr-1" />
            Warning
          </Badge>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: '-23px', left: '80px' }}>
          <Badge className="leading-none" size="sm" disableHover borderRadius="base" theme="destructive">
            <Icon name="cross" size={12} className="mr-1" />
            Error
          </Badge>
        </div>
      )}

      <div
        className={cn({
          'card-wrapper': nodeData.state === 'executing'
        })}
      >
        <div
          role="button"
          tabIndex={0}
          className={cn('box size-full rounded-xl border bg-primary-foreground cursor-pointer', {
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
        </div>
      </div>
    </>
  )
}
