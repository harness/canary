import { Label } from '@components/form-primitives/label'

export interface InputLabelProps {
  label?: string
  description?: string
  required?: boolean
  className?: string
}

function InputLabel(props: InputLabelProps): JSX.Element | null {
  const { label, required, className } = props

  if (!label) return null

  const labelText = required && label ? `${label} *` : label

  return <Label className={className}>{labelText}</Label>
}

export { InputLabel }
