export default function Port(props: { side: 'left' | 'right'; id?: string; adjustment?: number }) {
  const { adjustment = 0 } = props

  // TODO: port style
  return (
    <div
      id={props.id}
      style={{
        position: 'absolute',
        [props.side === 'left' ? 'left' : 'right']: '-3px',
        top: `calc( 50% - 2.5px + ${adjustment}px)`,
        width: '5px',
        height: '5px',
        background: '#121214',
        border: '1px solid #6D6B75',
        borderRadius: '50%'
      }}
    ></div>
  )
}
