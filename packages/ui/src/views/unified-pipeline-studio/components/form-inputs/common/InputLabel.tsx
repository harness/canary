import { Label } from '@components/form-primitives/label'
import { cn } from '@utils/cn'

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

  return <Label className={cn('mb-2.5 block', className)}>{labelText}</Label>
}

export default InputLabel
