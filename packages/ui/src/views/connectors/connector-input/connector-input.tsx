import { InputReference } from '@views/platform'
import { InputReferenceProps } from '@views/platform/input-reference-component'

import { ConnectorItem } from '../types'

export const ConnectorInput = ({
  value,
  onClick,
  onEdit,
  onClear,
  className,
  placeholder,
  label,
  ...props
}: Omit<InputReferenceProps<ConnectorItem>, 'icon'>) => {
  return (
    <InputReference<ConnectorItem>
      placeholder={placeholder}
      value={value}
      label={label}
      icon="connectors"
      onClick={onClick}
      onEdit={onEdit}
      onClear={onClear}
      className={className}
      {...props}
    />
  )
}
