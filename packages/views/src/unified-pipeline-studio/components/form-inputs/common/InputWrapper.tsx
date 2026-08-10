import { useEffect, useRef, useState } from 'react'

import { AnyFormValue, InputProps, isValidFixedShape, useController } from '@harnessio/forms'
import { Input } from '@harnessio/ui/components'

import { InputCaption, InputLabel } from '.'
import { InputValueType, RuntimeInputConfig } from '../types/types'
import {
  constructRuntimeInputValue,
  extractRuntimeInputName,
  getInputValueType,
  getRuntimeExpressionType
} from '../utils/input-value-utils'
import InputValueTypeSelection from './InputValueTypeSelector'

export interface InputWrapperProps extends InputProps<AnyFormValue, RuntimeInputConfig> {
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

  const [inputValueType, setInputValueType] = useState(() => {
    const currentValueType = getInputValueType(field.value)

    return isOnlyFixed && currentValueType === 'fixed' ? 'fixed' : currentValueType
  })

  useEffect(() => {
    if (field.value === '' && inputValueType !== 'fixed') {
      return
    }

    const currentValueType = getInputValueType(field.value)
    const nextInputValueType = isOnlyFixed && currentValueType === 'fixed' ? 'fixed' : currentValueType

    if (nextInputValueType !== inputValueType) {
      setInputValueType(nextInputValueType)
    }
  }, [field.value, inputValueType, isOnlyFixed])

  const cachedFixedValue = useRef(
    typeof field.value !== 'undefined' && getInputValueType(field.value) === 'fixed' && preserveFixedValue
      ? field.value
      : undefined
  )

  const renderContent = () => {
    switch (inputValueType) {
      case 'fixed':
        return children
      case 'runtime': {
        const runtimeExpressionType = getRuntimeExpressionType(field.value)
        const runtimePrefix = runtimeExpressionType === 'cel' ? '${{inputs.' : '<+inputs.'
        const runtimeSuffix = runtimeExpressionType === 'cel' ? '}}' : '>'

        return (
          <>
            <InputLabel label={label} required={required} />
            <div className="gap-cn-3xs flex grow items-center">
              {runtimePrefix}
              <Input
                wrapperClassName="flex-grow"
                autoFocus={true}
                placeholder={placeholder}
                value={extractRuntimeInputName(field.value)}
                onChange={evt => {
                  const newValue = constructRuntimeInputValue(evt.currentTarget.value, runtimeExpressionType)
                  field.onChange(newValue)
                }}
                disabled={readonly}
                tabIndex={0}
              />
              {runtimeSuffix}
            </div>
            <InputCaption error={fieldState?.error?.message} />
          </>
        )
      }
      case 'expression':
        return (
          <>
            <InputLabel label={label} required={required} />
            <div className="gap-cn-3xs flex grow items-center">
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
    <div className={'gap-cn-md flex items-end'}>
      <div className={'gap-cn-xs flex grow flex-col'}>{renderContent()}</div>
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
              if (
                typeof cachedFixedValue.current !== 'undefined' &&
                isValidFixedShape(cachedFixedValue.current, defaultEmptyValue)
              ) {
                field.onChange(cachedFixedValue.current)
              } else if (
                typeof input.default !== 'undefined' &&
                getInputValueType(input.default) === 'fixed' &&
                isValidFixedShape(input.default, defaultEmptyValue)
              ) {
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
