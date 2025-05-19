import { useEffect, useMemo } from 'react'

import { Select } from '@components/select'

import { InputComponent, InputProps, useController, useFormContext, type AnyFormikValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

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
  } & RuntimeInputConfig
}

type SelectInputProps = InputProps<AnyFormikValue, SelectInputConfig>

function SelectInputInternal(props: SelectInputProps): JSX.Element {
  const { path, input } = props
  const { label, required, description, inputConfig, readonly, placeholder } = input

  const methods = useFormContext()
  const values = methods.watch()

  const disabled = useMemo(() => {
    return readonly || !!inputConfig?.isDisabled?.(values)
  }, [readonly, inputConfig?.isDisabled, values])

  const { field, fieldState } = useController({
    name: path
  })

  useEffect(() => {
    if (disabled) {
      field.onChange(inputConfig?.disabledValue ?? '')
    }
  }, [disabled])

  return (
    <InputWrapper {...props}>
      <Select.Root
        label={label}
        caption={description}
        required={required}
        disabled={disabled}
        value={field.value}
        placeholder={placeholder}
        error={fieldState?.error?.message}
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
    </InputWrapper>
  )
}

export class SelectInput extends InputComponent<AnyFormikValue> {
  public internalType = 'select'

  renderComponent(props: SelectInputProps): JSX.Element {
    return <SelectInputInternal {...props} />
  }
}
