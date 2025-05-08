import { forwardRef } from 'react'

import { ControlGroup, FormCaption, Label } from '@/components'

import { BaseInput, InputProps } from './base-input'

export interface TextInputProps extends InputProps {
  type?: Exclude<HTMLInputElement['type'], 'number' | 'search'>
  wrapperClassName?: string
  // caption should take error and warning messages
  // based on theme it will be decided
  caption?: string
  // remove error and warningMessage
  // replace it with theme based
  error?: string
  warning?: string
  optional?: boolean
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { label, optional, caption, error, warning, wrapperClassName, ...restProps } = props
  return (
    <ControlGroup className={wrapperClassName}>
      {!!label && (
        <Label disabled={props.disabled} optional={optional} htmlFor={props.id}>
          {label}
        </Label>
      )}

      <BaseInput {...restProps} ref={ref} />

      {error ? (
        <FormCaption theme="danger">{error}</FormCaption>
      ) : warning ? (
        <FormCaption theme="warning">{warning}</FormCaption>
      ) : caption ? (
        <FormCaption>{caption}</FormCaption>
      ) : null}
    </ControlGroup>
  )
})

TextInput.displayName = 'TextInput'

export { TextInput }
