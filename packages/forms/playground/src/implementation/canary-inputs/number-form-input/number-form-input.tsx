import { JSX } from 'react'

import { isNull } from 'lodash-es'

import { InputComponent } from '@harnessio/forms'
import { NumberInput } from '@harnessio/ui/components'

import { useDynamicController } from '../common/hooks/use-dynamic-controller'
import { InputWrapper } from '../common/input-wrapper'
import { MultiTypeSelectButton } from '../common/multi-type-select-button'
import { useMultiTypeValue } from '../common/use-multitype-value'
import { useIsOptionalLabelVisible } from '../common/utils/form-utils'
import { convertStringToNumber } from '../common/utils/input-value-utils'
import { NumberFormInputProps, NumberFormInputType, NumberFormInputValueType } from './number-form-input-types'

function NumberFormInputInternal(props: NumberFormInputProps): JSX.Element {
  const { path, input, readonly, disabled } = props
  const { label, required, placeholder, inputConfig } = input

  const { field } = useDynamicController<NumberFormInputValueType>({
    name: path
  })

  const { inputValueType, setInputValueType, onlyFixedValueAllowed } = useMultiTypeValue({
    value: field.value,
    changeValue: field.onChange,
    allowedValueTypes: input.inputConfig?.allowedValueTypes,
    defaultValue: input.default
  })

  const optionalLabelVisible = useIsOptionalLabelVisible(input)

  return (
    <InputWrapper {...props} inputValueType={inputValueType} setInputValueType={setInputValueType} placement="prefix">
      <NumberInput
        label={label}
        optional={optionalLabelVisible}
        required={required}
        placeholder={placeholder}
        disabled={disabled || readonly}
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
        {...field}
        onChange={e => {
          const value = e.currentTarget.value
          const numberValue = convertStringToNumber(value)

          if (!isNull(numberValue)) {
            field.onChange(numberValue)
          } else {
            field.onChange(value)
          }
        }}
      />
    </InputWrapper>
  )
}

export class NumberFormInput extends InputComponent<NumberFormInputValueType> {
  public internalType: NumberFormInputType = 'number'

  renderComponent(props: NumberFormInputProps): JSX.Element {
    return <NumberFormInputInternal {...props} />
  }
}
