import { CSSProperties } from 'react'

import {
  parallelContainerConfig,
  serialContainerConfig
} from '@subjects/views/pipeline-edit/mocks/pipelineExecutionMock'

import { Button, Icon } from '@harnessio/ui/components'

const CONTAINER_WIDTH = '40'
const CONTAINER_HEIGHT = '40'

export interface FloatingAddButtonProp {
  parentNodeType?: 'leaf' | 'serial' | 'parallel'
  position: 'before' | 'after'
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  collapsed?: boolean
}

export function FloatingAddButton(props: FloatingAddButtonProp) {
  const { onClick, position, parentNodeType, collapsed } = props

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
    !!typeStyleConf && collapsed === false ? typeStyleConf.paddingTop - typeStyleConf.paddingBottom : 0

  return (
    <div className="group absolute flex size-full items-center justify-center" style={style}>
      <Button
        className="bg-background-2 hidden size-5 self-center rounded-full p-0 group-hover:flex"
        style={{
          alignSelf: 'center',
          marginTop: `${buttonMarginTopValue}px`
        }}
        variant="outline"
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
