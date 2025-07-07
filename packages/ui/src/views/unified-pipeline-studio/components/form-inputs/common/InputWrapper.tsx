import { useRef, useState } from 'react'

import { Input } from '@components/index'

import { AnyFormikValue, InputProps, useController } from '@harnessio/forms'

import { InputCaption, InputLabel } from '.'
import { InputValueType, RuntimeInputConfig } from '../types/types'
import { constructRuntimeInputValue, extractRuntimeInputName, getInputValueType } from '../utils/input-value-utils'
import InputValueTypeSelection from './InputValueTypeSelector'

export interface InputWrapperProps extends InputProps<AnyFormikValue, { inputConfig?: RuntimeInputConfig }> {
  children: JSX.Element | JSX.Element[]
  preserveFixedValue?: boolean
  defaultEmptyValue?: any
}

const isOnlyFixedValueAllowed = (inputValueTypes?: InputValueType[]) => {
  return (
    !inputValueTypes || inputValueTypes.length === 0 || (inputValueTypes.length === 1 && inputValueTypes[0] === 'fixed')
  )
}

export function InputWrapper({
  children,
  path,
  readonly,
  preserveFixedValue = true,
  defaultEmptyValue = '',
  input
}: InputWrapperProps): JSX.Element {
  const { label, placeholder, required, inputConfig } = input
  const isOnlyFixed = isOnlyFixedValueAllowed(inputConfig?.allowedValueTypes)

  const { field, fieldState } = useController({
    name: path
  })

  const [inputValueType, setInputValueType] = useState(isOnlyFixed ? 'fixed' : getInputValueType(field.value))

  // TODO
  // useEffect(() => {
  //   const newInputValueType = getInputValueType(field.value)
  //   if (newInputValueType !== inputValueType) {
  //     setInputValueType(newInputValueType)
  //   }
  // }, [field.value])

  const cachedFixedValue = useRef(
    typeof field.value !== 'undefined' && getInputValueType(field.value) === 'fixed' && preserveFixedValue
      ? field.value
      : undefined
  )

  const renderContent = () => {
    switch (inputValueType) {
      case 'fixed':
        return children
      case 'runtime':
        return (
          <>
            <InputLabel label={label} required={required} />
            <div className="flex grow items-center gap-1">
              {'<+input.'}
              <Input
                wrapperClassName="flex-grow"
                autoFocus={true}
                placeholder={placeholder}
                value={extractRuntimeInputName(field.value)}
                onChange={evt => {
                  const newValue = constructRuntimeInputValue(evt.currentTarget.value)
                  field.onChange(newValue)
                }}
                disabled={readonly}
                tabIndex={0}
              />
              {'>'}
            </div>
            <InputCaption error={fieldState?.error?.message} />
          </>
        )
      case 'expression':
        return (
          <>
            <InputLabel label={label} required={required} />
            <div className="flex grow items-center gap-1">
              &#931;{' '}
              <Input
                wrapperClassName="flex-grow"
                autoFocus={true}
                placeholder={placeholder}
                {...field}
                disabled={readonly}
                tabIndex={0}
              />
            </div>
            <InputCaption error={fieldState?.error?.message} />
          </>
        )
    }
  }

  return (
    <div className={'flex items-end gap-4'}>
      <div className={'flex grow flex-col gap-2'}>{renderContent()}</div>
      {!isOnlyFixed && (
        <InputValueTypeSelection
          inputValueType={inputValueType}
          setInputValueType={newInputValueType => {
            if (inputValueType === newInputValueType) {
              return
            }

            if (newInputValueType === 'fixed') {
              // NOTE: change to fixed value
              // restore from cache
              if (typeof cachedFixedValue.current !== 'undefined') {
                field.onChange(cachedFixedValue.current)
              } else if (typeof input.default !== 'undefined' && typeof getInputValueType(input.default)) {
                field.onChange(input.default)
              } else {
                field.onChange(defaultEmptyValue)
              }
            } else if (inputValueType === 'fixed') {
              // NOTE: change from fixed value
              // put to cache
              if (preserveFixedValue) {
                cachedFixedValue.current = field.value
              }
              // NOTE: runtime or expression are reset to empty string
              field.onChange('')
            } else {
              // NOTE: runtime or expression are reset to empty string
              field.onChange('')
            }

            setInputValueType(newInputValueType)
          }}
        />
      )}
    </div>
  )
}
