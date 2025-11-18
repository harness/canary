import { Label } from '@components/form-primitives/label'

export interface InputLabelProps {
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

function InputLabel(props: InputLabelProps): JSX.Element | null {
  const { label, required, disabled, className } = props

  if (!label) return null

  return (
    <Label disabled={disabled} optional={!required} className={className}>
      {label}
    </Label>
  )
}

export { InputLabel }
