import { LayoutConfig } from '../../types/layout'

export default function Port(props: {
  side: 'left' | 'right'
  id?: string
  adjustment?: number
  layout: LayoutConfig
  hidden?: boolean
}) {
  const { adjustment = 0, layout, hidden } = props

  const r = 1

  let top: string
  if (layout.type === 'top' && typeof layout.portPosition === 'number') {
    top = `${layout.portPosition}px`
  } else if (layout.type == 'harness') {
    top = `${adjustment - r / 2}px`
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
        visibility: hidden ? 'hidden' : 'visible'
      }}
    ></div>
  )
}
