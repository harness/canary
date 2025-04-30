import { useRef, useState } from 'react'

import { AnyFormikValue, InputProps, useController } from '../../../../../src'
import InputValueTypeSelection from '../../../examples/runtime-example/components/input-value-type-selector'
import {
  constructRuntimeInputValue,
  extractRuntimeInputName,
  getInputValueType
} from '../../../examples/runtime-example/utils/input-value-utils'
import { InputError } from './input-errror'
import InputLabel from './input-label'

export interface InputWrapperProps extends InputProps<AnyFormikValue> {
  children: JSX.Element | JSX.Element[]
  preserveFixedValue?: boolean
  defaultEmptyValue?: any
}

function InputWrapper({
  children,
  path,
  readonly,
  preserveFixedValue = true,
  defaultEmptyValue = '',
  input
}: InputWrapperProps): JSX.Element {
  const { label, placeholder, required } = input

  const { field } = useController({
    name: path
  })

  const [inputValueType, setInputValueType] = useState(getInputValueType(field.value))

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

  console.log(cachedFixedValue.current)

  const renderContent = () => {
    switch (inputValueType) {
      case 'fixed':
        return children
      case 'runtime':
        return (
          <>
            <InputLabel label={label} required={required} />
            {'<+input. '}
            <input
              autoFocus={true}
              placeholder={placeholder}
              // {...field}
              value={extractRuntimeInputName(field.value)}
              onChange={evt => {
                const newValue = constructRuntimeInputValue(evt.currentTarget.value)
                field.onChange(newValue)
              }}
              disabled={readonly}
              tabIndex={0}
            />
            {' >'}
            <InputError path={path} />
          </>
        )
      case 'expression':
        return (
          <>
            <InputLabel label={label} required={required} />
            &#931; <input autoFocus={true} placeholder={placeholder} {...field} disabled={readonly} tabIndex={0} />
            <InputError path={path} />
          </>
        )
    }
  }

  return (
    <div style={{ padding: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
      <div>{renderContent()}</div>

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
    </div>
  )
}

export default InputWrapper
