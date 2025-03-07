export interface InputLabelProps {
  label?: string
  required?: boolean
}

function InputLabel(props: InputLabelProps): JSX.Element {
  const { label, required } = props

  const labelText = required && label ? `${label} *` : label

  return (
    <div className="flex">
      <div className="text-muted-foreground">{labelText}</div>
    </div>
  )
}

export default InputLabel
