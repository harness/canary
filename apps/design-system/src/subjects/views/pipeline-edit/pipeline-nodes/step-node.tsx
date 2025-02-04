import { Button, Icon, Text } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/views'

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
  const { name, icon, selected, onEllipsisClick, onClick, onAddClick, isFirst, parentNodeType } = props

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn('box-border size-full rounded-xl border bg-primary-foreground cursor-pointer', {
        'border-borders-2': !selected,
        'border-borders-3': selected
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
      {/* position="left" */}
      <div>{icon}</div>
      <Text title={name} className="text-primary m-2 line-clamp-2">
        {name}
      </Text>

      {/* TODO */}
      {/* 
      <svg
        viewBox="0 0 140 80"
        style={{ position: 'absolute', zIndex: '-10', top: '0px', left: '0px', overflow: 'visible' }}
      >
        <path d={createRoundedRectPath(0, 0, 140, 80, 5)} strokeWidth={'1'} stroke="#454545" fill="none"></path>
      </svg>

      {nodeData.state === 'executing' && (
        <svg
          viewBox="0 0 140 80"
          style={{ position: 'absolute', zIndex: '-10', top: '0px', left: '0px', overflow: 'visible' }}
        >
          <path
            d={createRoundedRectPath(0, 0, 140, 80, 5)}
            strokeWidth={'1'}
            stroke="#43b5e6"
            fill="none"
            className="PipelineGraph-AnimateNode"
            stroke-dasharray={280 + 160}
            stroke-dashoffset={280 + 160}
          ></path>
        </svg>
      )}

      {nodeData.state === 'executed' && (
        <svg
          viewBox="0 0 140 80"
          style={{ position: 'absolute', zIndex: '-8', top: '0px', left: '0px', overflow: 'visible' }}
        >
          <path d={createRoundedRectPath(0, 0, 140, 80, 5)} strokeWidth={'1'} stroke="#43b5e6" fill="none"></path>
        </svg>
      )} */}
    </div>
  )
}
