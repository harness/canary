export default function Port(props: { side: 'left' | 'right'; id?: string; adjustment?: number }) {
  const { adjustment = 0 } = props

  const lineWeight = 1
  const r = 5

  return (
    <div
      id={props.id}
      style={{
        position: 'absolute',
        [props.side === 'left' ? 'left' : 'right']: `-${r / 2}px`,
        top: `calc( 50% - ${r / 2}px + ${adjustment}px)`,
        width: `${r}px`,
        height: `${r}px`,
        background: 'hsl(var(--canary-background-02))',
        border: `${lineWeight}px solid hsl(var(--canary-border-03))`,
        borderRadius: '50%',
        boxSizing: 'border-box'
      }}
    ></div>
  )
}
