import { useState } from 'react'

import { TextInput } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import InputValueTypeSelection from './common/InputValueTypeSelector'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'
import { getInputValueType, isOnlyFixedValueAllowed } from './utils/input-value-utils'

export interface TextFormInputConfig {
  inputType: 'text'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type TextFormInputProps = InputProps<AnyFormikValue, TextFormInputConfig>

function TextFormInputInternal(props: TextFormInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label, required, placeholder, description } = input

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  const isOnlyFixed = isOnlyFixedValueAllowed(input.inputConfig?.allowedValueTypes)

  const [inputValueType, setInputValueType] = useState(isOnlyFixed ? 'fixed' : getInputValueType(field.value))

  return (
    <InputWrapper {...props} hideInputValueTypeSelection>
      <TextInput
        label={label}
        caption={description}
        optional={!required}
        placeholder={placeholder}
        error={fieldState?.error?.message}
        suffix={<InputValueTypeSelection inputValueType={inputValueType} setInputValueType={setInputValueType} />}
        {...field}
      />
    </InputWrapper>
  )
}

export class TextFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'text'

  renderComponent(props: TextFormInputProps): JSX.Element {
    return <TextFormInputInternal {...props} />
  }
}
