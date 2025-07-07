import { NumberInput } from '@components/index'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface NumberFormInputConfig {
  inputType: 'number'
  inputConfig?: {
    tooltip?: string
  } & RuntimeInputConfig
}

type NumberFormInputProps = InputProps<AnyFormikValue, NumberFormInputConfig>

function NumberFormInputInternal(props: NumberFormInputProps): JSX.Element {
  const { readonly, path, input } = props
  const { label, required, placeholder, description } = input

  const { field, fieldState } = useController({
    name: path,
    disabled: readonly
  })

  return (
    <InputWrapper {...props}>
      <NumberInput
        label={label}
        required={required}
        caption={description}
        error={fieldState?.error?.message}
        placeholder={placeholder}
        {...field}
      />
    </InputWrapper>
  )
}

export class NumberFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'number'

  renderComponent(props: NumberFormInputProps): JSX.Element {
    return <NumberFormInputInternal {...props} />
  }
}
