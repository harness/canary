import { JSX, useCallback, useState } from 'react'

import { AnyFormValue, InputProps, useController } from '@harnessio/forms'
import { ControlGroup, Layout, TextInput } from '@harnessio/ui/components'

import { CommonFormInputConfig, InputValueType, RuntimeInputConfig } from '../../types/types'
import { InputCommonCaption } from './input-common-caption'
import { InputInfo } from './input-info'
import { MultiTypeSelectButton } from './multi-type-select-button'
import { RuntimeInput } from './runtime-input'
import { getInputValueType } from './utils/input-value-utils'

export interface InputWrapperProps extends InputProps<AnyFormValue, RuntimeInputConfig & CommonFormInputConfig> {
  children: JSX.Element | (JSX.Element | null)[] | null
  inputValueType?: any
  setInputValueType?: any
  placement?: 'prefix' | 'label' | 'generic'
  captionSection?: JSX.Element
  /* if captionSection is set, customError is ignored */
  customError?: string
}

const isOnlyFixedValueAllowed = (inputValueTypes?: InputValueType[]) => {
  return (
    !inputValueTypes || inputValueTypes.length === 0 || (inputValueTypes.length === 1 && inputValueTypes[0] === 'fixed')
  )
}

export function InputWrapper({
  children,
  path,
  input,
  placement = 'generic',
  inputValueType,
  setInputValueType,
  /** override default caption section */
  captionSection,
  warning,
  customError
  // TODO: provide input default value. used if input.default is not provided
  // defaultValue
}: InputWrapperProps): JSX.Element {
  const { label, placeholder, required, inputConfig, description } = input
  const isOnlyFixed = isOnlyFixedValueAllowed(inputConfig?.allowedValueTypes)

  const { field, fieldState } = useController({
    name: path
  })

  // TODO: remove this after all inputs are migrated
  const [inputValueTypeLocal_Tmp, setInputValueTypeLocal_Tmp] = useState(
    isOnlyFixed ? 'fixed' : getInputValueType(field.value)
  )
  if (!inputValueType) {
    inputValueType = inputValueTypeLocal_Tmp
    setInputValueType = setInputValueTypeLocal_Tmp
  }

  const renderContent = useCallback(() => {
    switch (inputValueType) {
      case 'runtime':
        return (
          <RuntimeInput
            required={required}
            placement={placement}
            tooltipContent={inputConfig?.tooltip}
            label={label}
            value={field.value}
            onInputChange={value => {
              field.onChange(value)
            }}
            onInputValueTypeChange={setInputValueType}
            input={input}
          />
        )
      case 'expression':
        return (
          <TextInput
            label={label}
            labelSuffix={
              placement === 'label' ? (
                <MultiTypeSelectButton.ForLabel
                  inputValueType={'runtime'}
                  setInputValueType={setInputValueType}
                  allowedValueTypes={inputConfig?.allowedValueTypes}
                />
              ) : undefined
            }
            tooltipContent={inputConfig?.tooltip}
            optional={!required}
            placeholder={'${{ expression }}'}
            value={field.value}
            onChange={e => {
              field.onChange(e.currentTarget.value)
            }}
            prefix={
              placement === 'prefix' ? (
                <MultiTypeSelectButton.ForPrefix
                  inputValueType={inputValueType}
                  setInputValueType={setInputValueType}
                  allowedValueTypes={inputConfig?.allowedValueTypes}
                />
              ) : undefined
            }
          />
        )
    }
  }, [
    label,
    description,
    required,
    placeholder,
    fieldState?.error?.message,
    inputValueType,
    setInputValueType,
    field,
    field.onChange,
    field.value
  ])

  return (
    <Layout.Horizontal gap="xs" align="end">
      <ControlGroup.Root className="grow">
        {inputValueType === 'fixed' ? children : renderContent()}
        {captionSection ? (
          captionSection
        ) : (
          <>
            <InputCommonCaption path={path} warning={warning} helper={description} customError={customError} />
            <InputInfo info={inputConfig?.info} />
          </>
        )}
      </ControlGroup.Root>
      {!isOnlyFixed && placement === 'generic' ? (
        <MultiTypeSelectButton.ForLabel
          inputValueType={inputValueType}
          setInputValueType={setInputValueType}
          allowedValueTypes={inputConfig?.allowedValueTypes}
        />
      ) : undefined}
    </Layout.Horizontal>
  )
}
