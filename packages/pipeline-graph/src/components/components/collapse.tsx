// TODO: move this component outside of library
export default function CollapseButton(props: { collapsed: boolean; onToggle?: () => void }) {
  const { collapsed, onToggle } = props

  return (
    <span
      onClick={onToggle}
      className={'collapse-button'}
      style={{
        color: 'white',
        border: '1px solid #333333',
        cursor: 'pointer',
        background: '#333333',
        borderRadius: '5px',
        padding: '0px 5px',
        fontFamily: 'monospace',
        pointerEvents: 'all'
      }}
    >
      {collapsed ? '+' : '-'}
    </span>
  )
}
