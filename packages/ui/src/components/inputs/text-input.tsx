import { forwardRef, useMemo } from 'react'

import { ControlGroup, FormCaption, Label } from '@/components'

import { BaseInput, InputProps } from './base-input'

export interface TextInputProps extends InputProps {
  type?: Exclude<HTMLInputElement['type'], 'number' | 'search' | 'hidden' | 'radio' | 'checkbox' | 'button'>
  wrapperClassName?: string
  caption?: string
  error?: string
  warning?: string
  optional?: boolean
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { label, optional, caption, error, warning, wrapperClassName, ...restProps } = props

  // override theme based on error and warning
  const theme = error ? 'danger' : warning ? 'warning' : props.theme

  // Generate a unique ID if one isn't provided
  const inputId = useMemo(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`, [props.id])

  return (
    <ControlGroup className={wrapperClassName}>
      {!!label && (
        <Label disabled={restProps.disabled} optional={optional} htmlFor={inputId}>
          {label}
        </Label>
      )}

      <BaseInput {...restProps} ref={ref} theme={theme} id={inputId} />

      {error ? (
        <FormCaption disabled={restProps.disabled} theme="danger">
          {error}
        </FormCaption>
      ) : warning ? (
        <FormCaption disabled={restProps.disabled} theme="warning">
          {warning}
        </FormCaption>
      ) : caption ? (
        <FormCaption disabled={restProps.disabled}>{caption}</FormCaption>
      ) : null}
    </ControlGroup>
  )
})

TextInput.displayName = 'TextInput'

export { TextInput }
