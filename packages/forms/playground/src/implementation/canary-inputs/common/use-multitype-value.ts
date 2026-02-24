import { useRef, useState } from 'react'

import { AnyFormValue } from '@harnessio/forms'

import { InputValueType, RuntimeInputConfig } from '../../types/types'
import { getInputValueType, isOnlyFixedValueAllowed } from './utils/input-value-utils'

type CacheType = {
  fixed?: undefined
  runtime?: undefined
  expression?: undefined
}

function initializeValueCache(value: AnyFormValue) {
  const cachedValues: CacheType = {}

  if (typeof value !== 'undefined') {
    cachedValues[getInputValueType(value)] = value
  }

  return cachedValues
}

function updateCacheAndFormValue(
  cacheRef: React.RefObject<CacheType | undefined>,
  fromInputValueType: InputValueType,
  toInputValueType: InputValueType,
  value: AnyFormValue,
  changeValue: (value: AnyFormValue) => void
) {
  if (cacheRef.current) {
    cacheRef.current[fromInputValueType] = value
    changeValue?.(cacheRef.current?.[toInputValueType] ?? '') // TODO: add default/defaultEmpty
  }
}

export function useMultiTypeValue(props: {
  value: AnyFormValue
  changeValue: (value: AnyFormValue) => void
  allowedValueTypes: RuntimeInputConfig['allowedValueTypes']
  /** cache value of fixed/runtime/expression. when used switch between different types we show cached value for selected type */
  cacheMultiTypeValues?: boolean
  defaultEmptyValue?: AnyFormValue
  defaultValue?: AnyFormValue
}) {
  const { allowedValueTypes, value, changeValue, cacheMultiTypeValues = true } = props

  const valueRef = useRef(value)
  valueRef.current = value

  // cache for fixed/runtime/expression values
  const cachedFixedValueRef = useRef<CacheType | undefined>(
    cacheMultiTypeValues ? initializeValueCache(value) : undefined
  )

  const onlyFixedValueAllowed = isOnlyFixedValueAllowed(allowedValueTypes)

  const initialValueType = onlyFixedValueAllowed ? 'fixed' : getInputValueType(value)

  const [inputValueType, setInputValueTypeLocal] = useState(initialValueType)

  const setInputValueType = (newInputValueType: InputValueType) => {
    // if same do nothing
    if (inputValueType === newInputValueType) {
      return
    }

    // if cache enabled
    if (cacheMultiTypeValues) {
      updateCacheAndFormValue(cachedFixedValueRef, inputValueType, newInputValueType, value, changeValue)
    }

    setInputValueTypeLocal(newInputValueType)
  }

  return { inputValueType, setInputValueType, onlyFixedValueAllowed }
}
