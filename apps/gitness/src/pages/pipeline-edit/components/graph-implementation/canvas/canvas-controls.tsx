import { useCanvasContext } from '@harnessio/pipeline-graph'

import { CanvasButton } from './canvas-button'

export function CanvasControls() {
  const { increase, decrease, fit } = useCanvasContext()

  return (
    <div className="absolute bottom-3 left-3 flex flex-col gap-y-2">
      <CanvasButton onClick={() => increase()}>+</CanvasButton>
      <CanvasButton onClick={() => decrease()}>-</CanvasButton>
      <CanvasButton onClick={() => fit()}>
        <div className="size-3 border border-primary"></div>
      </CanvasButton>
    </div>
  )
}
