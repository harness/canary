import { Select } from '@components/select'

import { InputComponent, InputProps, useController, type AnyFormikValue } from '@harnessio/forms'

import { InputError } from './common/InputError'
import { InputLabel } from './common/InputLabel'
import { InputTooltip } from './common/InputTooltip'
import { InputWrapper } from './common/InputWrapper'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectInputConfig {
  inputType: 'select'
  inputConfig: {
    options: SelectOption[]
    tooltip?: string
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
      <InputError path={path} />
      {inputConfig?.tooltip && <InputTooltip tooltip={inputConfig.tooltip} />}
    </InputWrapper>
  )
}

export class SelectInput extends InputComponent<AnyFormikValue> {
  public internalType = 'select'

  renderComponent(props: InputProps<AnyFormikValue, SelectInputConfig>): JSX.Element {
    return <SelectInputInternal {...props} />
  }
}
