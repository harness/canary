import { forwardRef } from 'react'

import { ControlGroup, FormCaption, Label } from '@/components'

import { BaseInput, InputProps } from './base-input'

export interface TextInputProps extends InputProps {
  type?: Exclude<HTMLInputElement['type'], 'number' | 'search'>
  wrapperClassName?: string
  caption?: string
  error?: string
  warningMessage?: string
  optional?: boolean
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { label, optional, caption, error, warningMessage, wrapperClassName, ...restProps } = props
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
      ) : warningMessage ? (
        <FormCaption theme="warning">{warningMessage}</FormCaption>
      ) : caption ? (
        <FormCaption>{caption}</FormCaption>
      ) : null}
    </ControlGroup>
  )
})

TextInput.displayName = 'TextInput'

export { TextInput }
