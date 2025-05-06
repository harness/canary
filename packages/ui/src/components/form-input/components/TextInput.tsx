import { ControlGroup, FormCaption, Label } from '@/components'

import { BaseInput, InputProps } from './BaseInput'

interface TextInputProps extends InputProps {
  type?: Exclude<HTMLInputElement['type'], 'number' | 'search'>
  wrapperClassName?: string
  caption?: string
  error?: string
  warningMessage?: string
  optional?: boolean
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
      <BaseInput theme={theme} disabled={disabled} id={id} {...props} />

      {error ? (
        <FormCaption theme="danger">{error}</FormCaption>
      ) : warningMessage ? (
        <FormCaption theme="warning">{warningMessage}</FormCaption>
      ) : caption ? (
        <FormCaption>{caption}</FormCaption>
      ) : null}
    </ControlGroup>
  )
}

TextInput.displayName = 'TextInput'
