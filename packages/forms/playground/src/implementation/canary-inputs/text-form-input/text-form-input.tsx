import { JSX, memo } from 'react'

import { InputComponent } from '@harnessio/forms'
import { TextInput } from '@harnessio/ui/components'

import { useDynamicController } from '../common/hooks/use-dynamic-controller'
import { InputWrapper } from '../common/input-wrapper'
import { MultiTypeSelectButton } from '../common/multi-type-select-button'
import { useMultiTypeValue } from '../common/use-multitype-value'
import { formatLabel, useIsOptionalLabelVisible } from '../common/utils/form-utils'
import { TextFormInputProps, TextFormInputValueType } from './text-form-input-types'

const TextFormInputInternal = memo(function TextInputInternal(props: TextFormInputProps): JSX.Element {
  const { path, input, readonly, disabled } = props
  const { label, placeholder, inputConfig, autofocus } = input

  const { field } = useDynamicController<TextFormInputValueType>({ name: path })

  const { inputValueType, setInputValueType, onlyFixedValueAllowed } = useMultiTypeValue({
    value: field.value,
    changeValue: field.onChange,
    allowedValueTypes: inputConfig?.allowedValueTypes,
    defaultValue: input.default
  })

  const optionalLabelVisible = useIsOptionalLabelVisible(input)
  const formattedLabel = formatLabel(label)

  return (
    <InputWrapper {...props} inputValueType={inputValueType} setInputValueType={setInputValueType} placement="prefix">
      <TextInput
        {...field}
        type={inputConfig?.type || 'text'}
        disabled={disabled || readonly}
        // readOnly={readonly} // TODO: TBD readonly vs disabled
        label={formattedLabel}
        optional={optionalLabelVisible}
        placeholder={placeholder}
        tooltipContent={inputConfig?.tooltip}
        suffix={inputConfig?.suffix}
        autoFocus={autofocus}
        prefix={
          !onlyFixedValueAllowed ? (
            <MultiTypeSelectButton.ForPrefix
              inputValueType={inputValueType}
              setInputValueType={setInputValueType}
              allowedValueTypes={inputConfig?.allowedValueTypes}
            />
          ) : (
            inputConfig?.prefix
          )
        }
      />
    </InputWrapper>
  )
})

export class TextFormInput extends InputComponent<TextFormInputValueType> {
  public internalType = 'text'

  renderComponent(props: TextFormInputProps): JSX.Element {
    return <TextFormInputInternal {...props} />
  }
}
