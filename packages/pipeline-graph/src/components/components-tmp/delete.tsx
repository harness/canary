// TODO: move this component outside of library
export default function DeleteButton(props: { path: string; hAdjustment?: number }) {
  return (
    <div
      className={'delete-node-button'}
      data-action={'delete'}
      data-path={props.path}
      style={{
        display: 'flex',
        width: '36px',
        height: '36px',
        position: 'absolute',
        zIndex: 100,
        right: '-18px',
        top: '-18px',
        padding: '0px',
        border: '1px solid #333333',
        cursor: 'pointer',
        background: '#222222',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'all'
      }}
    >
      X
    </div>
  )
}
