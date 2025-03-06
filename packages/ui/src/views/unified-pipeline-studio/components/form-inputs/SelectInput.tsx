import { Select } from '@components/select'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import InputLabel from './common/InputLabel'
import InputWrapper from './common/InputWrapper'
import { InputType } from './types'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectInputConfig {
  inputType: InputType.select
  inputConfig: {
    options: SelectOption[]
  }
}
function SelectInputInternal(props: InputProps<AnyFormikValue, SelectInputConfig>): JSX.Element {
  const { readonly, path, input } = props
  const { label = '', required, description, inputConfig } = input

  const { field } = useController({
    name: path
  })

  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <Select.Root
        disabled={readonly}
        value={field.value}
        onValueChange={value => {
          field.onChange(value)
        }}
      >
        <Select.Content>
          {inputConfig?.options.map(item => {
            return (
              <Select.Item key={item.value} value={item.value}>
                {item.label}
              </Select.Item>
            )
          })}
        </Select.Content>
      </Select.Root>
      <InputError />
    </InputWrapper>
  )
}

export class SelectInput extends InputComponent<AnyFormikValue> {
  public internalType = InputType.select

  renderComponent(props: InputProps<AnyFormikValue, SelectInputConfig>): JSX.Element {
    return <SelectInputInternal {...props} />
  }
}
