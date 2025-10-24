import { useCanvasContext } from '@harnessio/pipeline-graph'

import { CanvasButton } from './canvas-button'

export function CanvasControls() {
  const { reset } = useCanvasContext()

  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-y-2">
      <CanvasButton onClick={() => reset()}>
        <div className="border-primary size-3 border"></div>
      </CanvasButton>
    </div>
  )
}
