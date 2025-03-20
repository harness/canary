import { InputReference } from '@views/platform'
import { InputReferenceProps } from '@views/platform/input-reference-component'

import { SecretItem } from '../types'

export const SecretInput = ({
  value,
  onClick,
  onEdit,
  onClear,
  className,
  placeholder,
  label,
  ...props
}: InputReferenceProps<SecretItem | string>) => {
  return (
    <InputReference<SecretItem | string>
      placeholder={placeholder}
      value={value}
      label={label}
      icon="key"
      onClick={onClick}
      onEdit={onEdit}
      onClear={onClear}
      className={className}
      {...props}
    />
  )
}
