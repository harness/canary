import { JSX, memo } from 'react'
import { useController } from 'react-hook-form'

import { InputComponent } from '../../../core'
import { TextFormInputProps, TextFormInputValueType } from './text-form-input-types'

const TextFormInputInternal = memo(function TextInputInternal(props: TextFormInputProps): JSX.Element {
  const { path, input, readonly, disabled, warning } = props
  const { label, placeholder, required } = input

  const { field, fieldState } = useController({ name: path })
  const { error } = fieldState

  return (
    <div>
      <label>
        {label}
        {required && ' *'}
      </label>
      <input
        {...field}
        disabled={disabled || readonly}
        placeholder={placeholder}
        required={required}
        data-testid={`input-${label?.toLowerCase().replace(/\s+/g, '-')}`}
      />
      {error && <span data-testid={`error-${label?.toLowerCase().replace(/\s+/g, '-')}`}>{error.message}</span>}
      {warning && <span data-testid={`warning-${label?.toLowerCase().replace(/\s+/g, '-')}`}>{warning}</span>}
    </div>
  )
})

export class TextFormInput extends InputComponent<TextFormInputValueType> {
  public internalType = 'text'

  renderComponent(props: TextFormInputProps): JSX.Element {
    return <TextFormInputInternal {...props} />
  }
}
