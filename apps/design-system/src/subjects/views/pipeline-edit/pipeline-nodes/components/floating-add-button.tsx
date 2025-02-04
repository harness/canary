import { CSSProperties } from 'react'

import { Button, Icon } from '@harnessio/ui/components'

const CONTAINER_WIDTH = '36'
const CONTAINER_HEIGHT = '36'

export interface FloatingAddButtonProp {
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  position: 'before' | 'after'
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export function FloatingAddButton(props: FloatingAddButtonProp) {
  const { onClick, position, parentNodeType } = props

  const style: CSSProperties = {}
  if (position === 'before' && parentNodeType === 'serial') {
    style.left = `-${CONTAINER_WIDTH}px`
    style.width = `${CONTAINER_WIDTH}px`
    style.top = '0px'
    style.bottom = '0px'
  } else if (position === 'after' && parentNodeType === 'serial') {
    style.right = `-${CONTAINER_WIDTH}px`
    style.width = `${CONTAINER_WIDTH}px`
    style.top = '0px'
    style.bottom = '0px'
  }
  if (position === 'before' && parentNodeType === 'parallel') {
    style.top = `-${CONTAINER_HEIGHT}px`
    style.height = `${CONTAINER_HEIGHT}px`
    style.left = '0px'
    style.right = '0px'
  } else if (position === 'after' && parentNodeType === 'parallel') {
    style.bottom = `-${CONTAINER_HEIGHT}px`
    style.height = `${CONTAINER_HEIGHT}px`
    style.left = '0px'
    style.right = '0px'
  }

  return (
    <div className="group absolute flex size-full items-center justify-center" style={style}>
      <Button
        className="bg-primary-foreground hidden size-6 self-center rounded-full p-1 group-hover:flex"
        style={{ alignSelf: 'center' }}
        variant={'outline'}
        size={'sm'}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          onClick(e)
        }}
      >
        <Icon name="plus" size={15} />
      </Button>
    </div>
  )
}
