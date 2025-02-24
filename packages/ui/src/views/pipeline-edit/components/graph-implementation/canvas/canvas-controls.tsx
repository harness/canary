import { Icon } from '@components/icon'

import { useCanvasContext } from '@harnessio/pipeline-graph'

import { CanvasButton } from './canvas-button'

export function CanvasControls() {
  const { reset, increase, decrease } = useCanvasContext()

  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-y-2">
      <CanvasButton onClick={increase}>
        <Icon name="plus" />
      </CanvasButton>
      <CanvasButton onClick={decrease}>
        <Icon name="minus" />
      </CanvasButton>
      <CanvasButton onClick={reset}>
        <Icon name="square-dashed" />
      </CanvasButton>
    </div>
  )
}
