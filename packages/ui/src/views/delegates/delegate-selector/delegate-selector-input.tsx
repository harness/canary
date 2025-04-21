import { InputReference } from '@views/platform'
import { InputReferenceProps } from '@views/platform/input-reference-component'

export const DelegateSelectorInput = ({
  value,
  onClick,
  onEdit,
  onClear,
  className,
  placeholder,
  label,
  ...props
}: InputReferenceProps<string>) => {
  return (
    <InputReference<string>
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
