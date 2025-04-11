export default function Port(props: { side: 'left' | 'right'; id?: string; adjustment?: number }) {
  const { adjustment = 0 } = props

  const lineWeight = 1
  const r = 7

  return (
    <div
      id={props.id}
      style={{
        position: 'absolute',
        [props.side === 'left' ? 'left' : 'right']: `-${r / 2}px`,
        top: `calc( 50% - ${r / 2}px + ${adjustment}px)`,
        width: `${r}px`,
        height: `${r}px`,
        background: 'hsl(var(--cn-bg-2))',
        border: `${lineWeight}px solid hsl(var(--cn-border-1))`,
        borderRadius: '50%',
        boxSizing: 'border-box',
        zIndex: 1
      }}
    ></div>
  )
}
