export function UpdateValues({
  values,
  onUpdate,
  label = 'Update values'
}: {
  values: any
  onUpdate: (values: any) => void
  label?: string
}) {
  return (
    <div style={{ flexGrow: '1' }}>
      <div style={{ border: '1px solid lightgray', padding: '10px' }}>
        <button onClick={() => onUpdate(values)}>{label}</button>
        <pre>{JSON.stringify(values, undefined, 2)}</pre>
      </div>
    </div>
  )
}
