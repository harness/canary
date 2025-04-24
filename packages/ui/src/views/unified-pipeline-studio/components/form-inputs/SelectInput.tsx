import { useEffect, useMemo } from 'react'

import { Select } from '@components/select'

import { InputComponent, InputProps, useController, useFormContext, type AnyFormikValue } from '@harnessio/forms'

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
    isDisabled?: (values: AnyFormikValue) => boolean
    disabledValue?: string
  }
}
function SelectInputInternal(props: InputProps<AnyFormikValue, SelectInputConfig>): JSX.Element {
  const { path, input } = props
  const { label = '', required, description, inputConfig, readonly } = input

  const methods = useFormContext()
  const values = methods.watch()

  const disabled = useMemo(() => {
    return readonly || !!inputConfig?.isDisabled?.(values)
  }, [readonly, inputConfig?.isDisabled, values])

  const { field } = useController({
    name: path
  })

  useEffect(() => {
    if (disabled) {
      field.onChange(inputConfig?.disabledValue ?? '')
    }
  }, [disabled])

  return (
    <InputWrapper>
      <InputLabel label={label} description={description} required={required} />
      <Select.Root
        disabled={disabled}
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
