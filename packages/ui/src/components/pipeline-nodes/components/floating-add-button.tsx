import { CSSProperties } from 'react'

import { Button } from '@components/button'
import { Icon } from '@components/icon'

import { ParallelContainerConfigType, SerialContainerConfigType } from '@harnessio/pipeline-graph'

const CONTAINER_WIDTH = '40'
const CONTAINER_HEIGHT = '40'

export interface FloatingAddButtonProp {
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  position: 'before' | 'after'
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  collapsed?: boolean
  parallelContainerConfig?: Partial<ParallelContainerConfigType>
  serialContainerConfig?: Partial<SerialContainerConfigType>
}

export function FloatingAddButton(props: FloatingAddButtonProp) {
  const { onClick, position, parentNodeType, collapsed, parallelContainerConfig, serialContainerConfig } = props

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

  const typeStyleConf =
    parentNodeType === 'parallel'
      ? parallelContainerConfig
      : parentNodeType === 'serial'
        ? serialContainerConfig
        : undefined
  const buttonMarginTopValue =
    !!typeStyleConf && collapsed === false ? (typeStyleConf?.paddingTop ?? 0) - (typeStyleConf?.paddingBottom ?? 0) : 0

  return (
    <div className="group absolute flex size-full items-center justify-center" style={style}>
      <Button
        iconOnly
        rounded
        className="hidden self-center p-0 group-hover:flex"
        style={{
          alignSelf: 'center',
          marginTop: `${buttonMarginTopValue}px`
        }}
        variant="surface"
        theme="muted"
        onMouseDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation()
          onClick(e)
        }}
      >
        <Icon className="text-icons-3" name="bold-plus" size={10} />
      </Button>
    </div>
  )
}
