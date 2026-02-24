import { JSX, useEffect } from 'react'

import { InputComponent, useFormContext, useRootFormContext } from '@harnessio/forms'
import { Select } from '@harnessio/ui/components'

import { useDynamicController } from '../common/hooks/use-dynamic-controller'
import { InputWrapper } from '../common/input-wrapper'
import { MultiTypeSelectButton } from '../common/multi-type-select-button'
import { useMultiTypeValue } from '../common/use-multitype-value'
import { formatLabel, useIsOptionalLabelVisible } from '../common/utils/form-utils'
import { SelectFormInputProps, SelectFormInputType, SelectFormInputValueType } from './select-form-input-types'

function SelectFormInputInternal(props: SelectFormInputProps): JSX.Element {
  const { path, input, readonly, disabled } = props
  const { label, inputConfig, placeholder } = input

  const { field } = useDynamicController<SelectFormInputValueType>({
    name: path
  })

  const { metadata } = useRootFormContext()
  const { watch } = useFormContext()
  const values = watch()

  const options =
    typeof inputConfig?.options === 'function' ? inputConfig.options(values, metadata) : (inputConfig?.options ?? [])

  useEffect(() => {
    if (disabled) {
      // workaround: timeout added to ensure if input is initially disabled it sets disabled value to the field
      setTimeout(() => {
        field.onChange(inputConfig?.disabledValue ?? '')
      }, 0)
    }
  }, [disabled])

  const { inputValueType, setInputValueType, onlyFixedValueAllowed } = useMultiTypeValue({
    value: field.value,
    changeValue: field.onChange,
    allowedValueTypes: input.inputConfig?.allowedValueTypes,
    defaultValue: input.default
  })

  const optionalLabelVisible = useIsOptionalLabelVisible(input)
  const formattedLabel = formatLabel(label)

  return (
    <InputWrapper {...props} inputValueType={inputValueType} setInputValueType={setInputValueType} placement="prefix">
      <Select
        label={formattedLabel}
        tooltipContent={inputConfig?.tooltip}
        optional={optionalLabelVisible}
        disabled={disabled || readonly}
        // readOnly={readonly} // TODO: TBD readonly vs disabled
        value={field.value}
        placeholder={placeholder}
        options={options}
        onChange={value => {
          field.onChange(value)
        }}
        prefix={
          !onlyFixedValueAllowed ? (
            <MultiTypeSelectButton.ForPrefix
              inputValueType={inputValueType}
              setInputValueType={setInputValueType}
              allowedValueTypes={input.inputConfig?.allowedValueTypes}
            />
          ) : undefined
        }
        contentWidth="triggerWidth"
      />
    </InputWrapper>
  )
}

export class SelectFormInput extends InputComponent<SelectFormInputValueType> {
  public internalType: SelectFormInputType = 'select'

  renderComponent(props: SelectFormInputProps): JSX.Element {
    return <SelectFormInputInternal {...props} />
  }
}
