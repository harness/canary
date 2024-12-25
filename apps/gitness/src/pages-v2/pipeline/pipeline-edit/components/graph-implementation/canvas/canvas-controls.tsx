import { useCanvasContext } from '@harnessio/pipeline-graph'

import { CanvasButton } from './canvas-button'

export function CanvasControls() {
  const { fit } = useCanvasContext()

  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-y-2">
      {/* TODO: uncomment increase/decrease once its fixed in pipeline-graph */}
      {/* 
      <CanvasButton onClick={() => increase()}>+</CanvasButton>
      <CanvasButton onClick={() => decrease()}>-</CanvasButton> 
      */}
      <CanvasButton onClick={() => fit()}>
        <div className="size-3 border border-primary"></div>
      </CanvasButton>
    </div>
  )
}
