import DeleteButton from '../components-tmp/delete'

export default function DeleteContainer(props: { path: string }) {
  const { path } = props

  return (
    <div
      className={'delete-node-container'}
      style={{
        position: 'absolute',
        zIndex: 20,
        inset: 0
      }}
    >
      <DeleteButton path={path} />
    </div>
  )
}
