export function CanvasButton(props: React.PropsWithChildren<{ onClick: () => void }>) {
  const { children, onClick } = props

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        width: '30px',
        height: '30px',
        border: '1px solid #333333',
        cursor: 'pointer',
        background: '#333333',
        borderRadius: '5px',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </div>
  )
}
