import { InputReference } from '@views/platform'
import { InputReferenceProps } from '@views/platform/input-reference-component'

import { DelegateSelectorItem } from '../types'

export const DelegateSelectorInput = ({
  value,
  onClick,
  onEdit,
  onClear,
  className,
  placeholder,
  label,
  ...props
}: InputReferenceProps<DelegateSelectorItem>) => {
  return (
    <InputReference<DelegateSelectorItem>
      placeholder={placeholder}
      value={value}
      label={label}
      onClick={onClick}
      onEdit={onEdit}
      onClear={onClear}
      className={className}
      {...props}
    />
  )
}
