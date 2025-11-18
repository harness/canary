import { IconV2 } from '@components/icon-v2'

import { useCanvasContext } from '@harnessio/pipeline-graph'

import { CanvasButton } from './canvas-button'

export function CanvasControls() {
  const { reset, increase, decrease } = useCanvasContext()

  return (
    <div className="absolute bottom-cn-xs right-cn-xs flex flex-col gap-y-cn-xs">
      <CanvasButton onClick={increase}>
        <IconV2 name="plus" />
      </CanvasButton>
      <CanvasButton onClick={decrease}>
        <IconV2 name="minus" />
      </CanvasButton>
      <CanvasButton onClick={reset}>
        <IconV2 name="square-dashed" />
      </CanvasButton>
    </div>
  )
}
