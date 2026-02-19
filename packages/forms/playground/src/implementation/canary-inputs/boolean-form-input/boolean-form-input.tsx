import { JSX } from 'react'

import { InputComponent } from '@harnessio/forms'
import { Select } from '@harnessio/ui/components'

import { useDynamicController } from '../common/hooks/use-dynamic-controller'
import { InputWrapper } from '../common/input-wrapper'
import { MultiTypeSelectButton } from '../common/multi-type-select-button'
import { useMultiTypeValue } from '../common/use-multitype-value'
import { formatLabel, useIsOptionalLabelVisible } from '../common/utils/form-utils'
import { BooleanFormInputProps, BooleanFormInputType, BooleanFormInputValueType } from './boolean-form-input-types'

const options = [
  { label: 'True', value: true },
  { label: 'False', value: false }
]
function BooleanFormInputInternal(props: BooleanFormInputProps): JSX.Element {
  const { path, input, readonly, disabled } = props
  const { label, placeholder, inputConfig } = input

  const { field } = useDynamicController<BooleanFormInputValueType>({ name: path })

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
      <Select<boolean>
        label={formattedLabel}
        optional={optionalLabelVisible}
        disabled={disabled || readonly}
        value={field.value}
        placeholder={placeholder}
        options={options}
        onChange={value => {
          field.onChange(value === true)
        }}
        tooltipContent={inputConfig?.tooltip}
        prefix={
          !onlyFixedValueAllowed ? (
            <MultiTypeSelectButton.ForPrefix
              inputValueType={inputValueType}
              setInputValueType={setInputValueType}
              allowedValueTypes={input.inputConfig?.allowedValueTypes}
            />
          ) : undefined
        }
        contentWidth="auto"
      />
    </InputWrapper>
  )
}

export class BooleanFormInput extends InputComponent<BooleanFormInputValueType> {
  public internalType: BooleanFormInputType = 'boolean'

  renderComponent(props: BooleanFormInputProps): JSX.Element {
    return <BooleanFormInputInternal {...props} />
  }
}
