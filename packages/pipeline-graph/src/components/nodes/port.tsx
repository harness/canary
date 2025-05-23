import { LayoutConfig } from '../../pipeline-graph-internal'

export default function Port(props: {
  side: 'left' | 'right'
  id?: string
  adjustment?: number
  layout: LayoutConfig
}) {
  const { adjustment = 0, layout } = props

  const lineWeight = 1
  const r = 7

  let top: string
  if (typeof layout.portPosition === 'number') {
    top = `${layout.portPosition}px`
  } else {
    top = `calc( 50% - ${r / 2}px + ${adjustment}px)`
  }

  return (
    <div
      id={props.id}
      style={{
        position: 'absolute',
        [props.side === 'left' ? 'left' : 'right']: `-${r / 2}px`,
        top,
        width: `${r}px`,
        height: `${r}px`,
        background: '#121214',
        border: `${lineWeight}px solid #6D6B75`,
        borderRadius: '50%',
        boxSizing: 'border-box'
      }}
    ></div>
  )
}
