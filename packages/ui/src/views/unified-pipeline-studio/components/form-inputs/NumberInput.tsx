import { NumberInput as NumberInputUI } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputCaption } from './common/InputCaption'
import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface NumberInputConfig {
  inputType: 'number'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type NumberInputProps = InputProps<AnyFormikValue, NumberInputConfig>

function NumberInputInternal(props: NumberInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label, required, placeholder, description } = input

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  return (
    <InputWrapper {...props}>
      <NumberInputUI
        label={label}
        required={required}
        caption={description}
        error={fieldState?.error?.message}
        placeholder={placeholder}
        {...field}
      />
      <InputCaption error={fieldState?.error?.message} />
    </InputWrapper>
  )
}

export class NumberInput extends InputComponent<AnyFormikValue> {
  public internalType = 'number'

  renderComponent(props: NumberInputProps): JSX.Element {
    return <NumberInputInternal {...props} />
  }
}
