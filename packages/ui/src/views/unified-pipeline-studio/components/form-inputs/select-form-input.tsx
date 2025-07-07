import { useEffect, useMemo } from 'react'

import { Select } from '@components/form-primitives'

import { InputComponent, InputProps, useController, useFormContext, type AnyFormikValue } from '@harnessio/forms'

import { InputWrapper } from './common/InputWrapper'
import { RuntimeInputConfig } from './types/types'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectFormInputConfig {
  inputType: 'select'
  inputConfig: {
    options: SelectOption[]
    tooltip?: string
    isDisabled?: (values: AnyFormikValue) => boolean
    disabledValue?: string
  } & RuntimeInputConfig
}

type SelectFormInputProps = InputProps<AnyFormikValue, SelectFormInputConfig>

function SelectFormInputInternal(props: SelectFormInputProps): JSX.Element {
  const { path, input } = props
  const { label, description, inputConfig, readonly, placeholder } = input
  const methods = useFormContext()
  const values = methods.watch()

  const disabled = useMemo(() => {
    return readonly || !!inputConfig?.isDisabled?.(values)
  }, [readonly, inputConfig?.isDisabled, values])

  const { field, fieldState } = useController({
    name: path
  })

  const inputConfigOptions = useMemo(
    () => inputConfig?.options.map(option => ({ label: option.label, value: option.value })) ?? [],
    [inputConfig?.options]
  )

  useEffect(() => {
    if (disabled) {
      field.onChange(inputConfig?.disabledValue ?? '')
    }
  }, [disabled])

  return (
    <InputWrapper {...props}>
      <Select
        label={label}
        options={inputConfigOptions}
        caption={description}
        disabled={disabled}
        value={field.value}
        placeholder={placeholder}
        error={fieldState?.error?.message}
        onChange={value => {
          field.onChange(value)
        }}
      />
    </InputWrapper>
  )
}

export class SelectFormInput extends InputComponent<AnyFormikValue> {
  public internalType = 'select'

  renderComponent(props: SelectFormInputProps): JSX.Element {
    return <SelectFormInputInternal {...props} />
  }
}
