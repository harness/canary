// TODO: move this component outside of library
export default function AddButton(props: { path: string; position?: 'before' | 'after' | 'in'; adjustment?: number }) {
  const { adjustment = 0 } = props
  return (
    <div
      className={'add-node-button'}
      data-action={'add'}
      data-path={props.path}
      data-position={props.position}
      style={{
        marginTop: `${adjustment * 2}px`,
        width: '45px',
        minWidth: '45px',
        height: '45px',
        padding: '0px',
        border: '1px solid #555',
        cursor: 'pointer',
        background: '#242429',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
      }}
    >
      +
    </div>
  )
}
