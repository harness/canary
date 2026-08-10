import { useEffect, useRef, useState } from 'react'



import { InputValueType, RuntimeInputConfig } from '../../types/types'
import { getInputValueType, isOnlyFixedValueAllowed } from './utils/input-value-utils'
import { AnyFormValue, isValidFixedShape } from '../../../../../src'

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

function getValueForInputValueType(
  cache: CacheType,
  toInputValueType: InputValueType,
  defaultEmptyValue?: AnyFormValue
): AnyFormValue {
  const cached = cache[toInputValueType]

  if (toInputValueType === 'fixed') {
    if (cached !== undefined && getInputValueType(cached) === 'fixed' && isValidFixedShape(cached, defaultEmptyValue)) {
      return cached
    }

    return defaultEmptyValue ?? ''
  }

  return cached ?? ''
}

function updateCacheAndFormValue(
  cacheRef: React.RefObject<CacheType | undefined>,
  fromInputValueType: InputValueType,
  toInputValueType: InputValueType,
  value: AnyFormValue,
  changeValue: (value: AnyFormValue) => void,
  defaultEmptyValue?: AnyFormValue
) {
  if (cacheRef.current) {
    cacheRef.current[fromInputValueType] = value
    changeValue?.(getValueForInputValueType(cacheRef.current, toInputValueType, defaultEmptyValue))
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
  const { allowedValueTypes, value, changeValue, cacheMultiTypeValues = true, defaultEmptyValue } = props

  const valueRef = useRef(value)
  valueRef.current = value

  // cache for fixed/runtime/expression values
  const cachedFixedValueRef = useRef<CacheType | undefined>(
    cacheMultiTypeValues ? initializeValueCache(value) : undefined
  )

  const onlyFixedValueAllowed = isOnlyFixedValueAllowed(allowedValueTypes)

  const initialValueType = onlyFixedValueAllowed ? 'fixed' : getInputValueType(value)

  const [inputValueType, setInputValueTypeLocal] = useState(initialValueType)

  useEffect(() => {
    if (value === '' && inputValueType !== 'fixed') {
      return
    }

    const currentValueType = getInputValueType(value)
    const nextInputValueType = onlyFixedValueAllowed && currentValueType === 'fixed' ? 'fixed' : currentValueType

    if (nextInputValueType !== inputValueType) {
      setInputValueTypeLocal(nextInputValueType)
    }
  }, [inputValueType, onlyFixedValueAllowed, value])

  const setInputValueType = (newInputValueType: InputValueType) => {
    // if same do nothing
    if (inputValueType === newInputValueType) {
      return
    }

    // if cache enabled
    if (cacheMultiTypeValues) {
      updateCacheAndFormValue(
        cachedFixedValueRef,
        inputValueType,
        newInputValueType,
        value,
        changeValue,
        defaultEmptyValue
      )
    } else if (newInputValueType === 'fixed') {
      changeValue(defaultEmptyValue ?? '')
    } else {
      changeValue('')
    }

    setInputValueTypeLocal(newInputValueType)
  }

  return { inputValueType, setInputValueType, onlyFixedValueAllowed }
}
