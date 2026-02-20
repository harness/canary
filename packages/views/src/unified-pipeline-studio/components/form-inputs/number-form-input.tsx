import { NumberInput } from '@harnessio/ui/components'

import { IInputDefinition, InputComponent, InputProps, useController, type AnyFormValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface NumberFormInputConfig extends RuntimeInputConfig {
  tooltip?: string
}

export type NumberFormInputDefinition = IInputDefinition<NumberFormInputConfig, AnyFormValue, 'number'>

type NumberFormInputProps = InputProps<AnyFormValue, NumberFormInputConfig>

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

export class NumberFormInput extends InputComponent<AnyFormValue> {
  public internalType = 'number'

  renderComponent(props: NumberFormInputProps): JSX.Element {
    return <NumberFormInputInternal {...props} />
  }
}
