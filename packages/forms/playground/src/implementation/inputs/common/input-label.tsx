export interface InputLabelProps {
  label?: string | JSX.Element
  required?: boolean
}

function InputLabel(props: InputLabelProps): JSX.Element {
  const { label, required } = props

  const labelText = required && label ? <>{label} *</> : label

  return (
    <div className="flex">
      <div className="text-cn-3">{labelText}</div>
    </div>
  )
}

export default InputLabel
