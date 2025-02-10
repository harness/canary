import { useCanvasContext } from '../../../src/context/canvas-provider'
import { CanvasButton } from './CanvasButton'

export function CanvasControls() {
  const { increase, decrease, reset, fit } = useCanvasContext()

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        left: '10px',
        bottom: '10px',
        rowGap: '10px'
      }}
    >
      <CanvasButton onClick={() => increase()}>+</CanvasButton>
      <CanvasButton onClick={() => decrease()}>-</CanvasButton>
      <CanvasButton onClick={() => reset()}>RES</CanvasButton>
      <CanvasButton onClick={() => fit()}>FIT</CanvasButton>
    </div>
  )
}
