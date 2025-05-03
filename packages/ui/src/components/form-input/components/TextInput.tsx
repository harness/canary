import { Caption, ControlGroup, Label } from '@/components'

import { BaseInput, InputProps } from './BaseInput'

interface TextInputProps extends InputProps {
  type?: Exclude<HTMLInputElement['type'], 'number' | 'search'>
}

export function TextInput({
  label,
  disabled,
  optional,
  id,
  theme,
  caption,
  error,
  warningMessage,
  wrapperClassName,
  ...props
}: TextInputProps) {
  return (
    <ControlGroup className={wrapperClassName}>
      {!!label && (
        <Label disabled={disabled} optional={optional} htmlFor={id}>
          {label}
        </Label>
      )}

      <BaseInput type="text" theme={theme} disabled={disabled} id={id} {...props} />

      {/* {!!error && (
        <Message className="mt-0.5" theme={MessageTheme.ERROR}>
          {error}
        </Message>
      )} */}

      <Caption theme={theme} message={caption} errorMessage={error} warningMessage={warningMessage} showIcon />
    </ControlGroup>
  )
}

TextInput.displayName = 'TextInput'
