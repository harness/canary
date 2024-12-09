import AddButton from '../components-tmp/add'
import { PARALLEL_NODE_GAP, PARALLEL_PADDING } from './parallel-container'
import { SERIAL_NODE_GAP, SERIAL_PADDING } from './serial-container'

export default function AddContainer(props: {
  path: string
  position: 'before' | 'after'
  orientation: 'horizontal' | 'vertical'
  isFirst: boolean
  isLast: boolean
  adjustment: number // for layout
}) {
  const { path, position, orientation, isFirst, isLast, adjustment } = props

  let size: number
  switch (orientation) {
    case 'vertical': {
      size =
        (isFirst && position === 'before') || (isLast && position === 'after') ? PARALLEL_PADDING : PARALLEL_NODE_GAP
      break
    }
    case 'horizontal': {
      size = (isFirst && position === 'before') || (isLast && position === 'after') ? SERIAL_PADDING : SERIAL_NODE_GAP
      break
    }
  }

  const style =
    orientation === 'vertical'
      ? {
          height: `${size}px`,
          left: '0px',
          right: '0px',
          bottom: position === 'after' ? `-${size}px` : 'initial',
          top: position === 'before' ? `-${size}px` : 'initial'
        }
      : {
          width: `${size}px`,
          top: '0px',
          bottom: '0px',
          right: position === 'after' ? `-${size}px` : 'initial',
          left: position === 'before' ? `-${size}px` : 'initial'
        }

  return (
    <div
      className={'add-node-container'}
      style={{
        position: 'absolute',
        zIndex: 10,
        ...style
      }}
    >
      <div
        data-path={path}
        data-action="add"
        style={{
          // background: "red", // TODO: add "debug" env variable for this
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          height: '100%'
        }}
      >
        <AddButton path={path} position={position} adjustment={adjustment} />
      </div>
    </div>
  )
}
