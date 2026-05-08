import {
  cloneDeep,
  get,
  isArray,
  isEmpty,
  isNil,
  isNull,
  isObject,
  isPlainObject,
  isString,
  isUndefined,
  omitBy
} from 'lodash-es'

import { IInputTransformerFunc, IOutputTransformerFunc } from '../../types'

export function objectToArrayInputTransformer(): IInputTransformerFunc {
  return function (value: Record<string, unknown>, _values: Record<string, unknown>) {
    if (typeof value === 'undefined') return undefined
    if (!value || !isPlainObject(value)) return { value }

    return {
      value: Object.getOwnPropertyNames(value).map(key => {
        return { key, value: value[key] }
      })
    }
  }
}

export function arrayToObjectOutputTransformer(options?: {
  unsetIfEmpty?: boolean
  fallbackValue?: unknown
  assignKeyToValue?: boolean
}): IOutputTransformerFunc {
  return function (value: { key: string; value: unknown }[]) {
    if (typeof value === 'undefined') return undefined
    if (!value || !isArray(value)) return { value }

    const retObj = {
      value: value.reduce((acc, rowValue) => {
        return {
          ...acc,
          [rowValue.key]: options?.assignKeyToValue ? rowValue.key : (rowValue.value ?? options?.fallbackValue)
        }
      }, {})
    }

    if (options?.unsetIfEmpty && Object.getOwnPropertyNames(retObj.value).length === 0) {
      return { value: undefined }
    }

    return retObj
  }
}

/**
 * unset property if it contains empty array
 */
export function unsetEmptyArrayOutputTransformer(): IOutputTransformerFunc {
  return function (value: unknown) {
    if (typeof value === 'undefined') return undefined

    if (isArray(value) && isEmpty(value)) {
      return { value: undefined }
    }

    return { value }
  }
}

/**
 * unset property if it contains empty object
 * @param path - If path is passed it will unset empty object on the path
 * @param useTargetValue - If true, use currentTargetValue instead of currentRawValue (useful for cleanup after child transformers)
 */
export function unsetEmptyObjectOutputTransformer(path?: string, useTargetValue?: boolean): IOutputTransformerFunc {
  return function (value: any, values: Record<string, any>, targetValue: any, targetValues: Record<string, any>) {
    // Choose which value to check based on parameters
    let checkValue: any
    if (path) {
      // When path is provided, get from appropriate values object
      checkValue = get(useTargetValue && targetValues ? targetValues : values, path)
    } else {
      // When no path, use current value (raw or target based on flag)
      checkValue = useTargetValue ? targetValue : value
    }

    if (typeof checkValue === 'undefined') return undefined

    if (isNull(checkValue)) return { value: undefined, path }

    if (isObject(checkValue)) {
      const cleanObj = cleanUpObject(cloneDeep(checkValue))
      if (Object.getOwnPropertyNames(cleanObj).length === 0) {
        return { value: undefined, path }
      } else {
        // if its object and not empty, just ignore it
        return undefined
      }
    }

    return { value: checkValue, path }
  }
}

/**
 * unset property if it contains empty string
 */
export function unsetEmptyStringOutputTransformer(): IOutputTransformerFunc {
  return function (value: unknown) {
    if (typeof value === 'undefined') return undefined

    if (isString(value) && isEmpty(value)) {
      return { value: undefined }
    }

    return { value }
  }
}

export function shorthandObjectInputTransformer(parentPath: string): IInputTransformerFunc {
  return function (value: unknown, values: Record<string, unknown>) {
    const parent = get(values, parentPath)

    // If parent is a string (shorthand), extract it to the child field
    if (typeof parent === 'string') {
      return { value: parent }
    }

    // If parent is a primitive (number/boolean), we can't access child properties
    // Skip creating the child path
    if (typeof parent === 'number' || typeof parent === 'boolean') {
      return undefined
    }

    // If parent is object/array, use the actual child value
    // If value is undefined, don't create the path
    if (value === undefined) {
      return undefined
    }

    return { value }
  }
}

export function shorthandObjectOutputTransformer(parentPath: string): IOutputTransformerFunc {
  return function (
    value: unknown,
    values: Record<string, unknown>,
    _targetValue: unknown,
    targetValues: Record<string, unknown>
  ) {
    if (typeof value === 'undefined') return undefined
    if (!value) return { value }

    // Use targetValues instead of rawValues to check if we should collapse to shorthand
    // This ensures we see the result of previous transformers (like unsetEmptyStringOutputTransformer)
    const parentObj = get(targetValues || values, parentPath)

    if (typeof parentObj === 'object') {
      const cleanParentObj = cleanUpObject(parentObj)
      if (Object.getOwnPropertyNames(cleanParentObj).length === 1) {
        return { value, path: parentPath }
      }
    }

    return { value }
  }
}

export function shorthandArrayInputTransformer(parentPath: string): IInputTransformerFunc {
  return function (value: unknown, values: Record<string, unknown>) {
    const parent = get(values, parentPath)

    // If parent is a string (shorthand), wrap it in array
    if (typeof parent === 'string') {
      return { value: [parent] }
    }

    // If parent is a primitive (number/boolean), we can't access child properties
    if (typeof parent === 'number' || typeof parent === 'boolean') {
      return undefined
    }

    // If value is undefined, don't create the path
    if (value === undefined) {
      return undefined
    }

    return { value }
  }
}

export function shorthandArrayOutputTransformer(
  parentPath: string,
  options?: { unsetIfEmpty?: boolean }
): IOutputTransformerFunc {
  return function (value: unknown, values: Record<string, unknown>) {
    if (typeof value === 'undefined') return undefined
    if (!value) return { value }

    const parentArr = get(values, parentPath)

    if (isArray(parentArr)) {
      if (parentArr.length === 1) {
        return { value: parentArr[0], path: parentPath }
      } else if (parentArr.length === 0) {
        if (options?.unsetIfEmpty) {
          return { value: undefined, path: parentPath }
        }
      }
    }

    return { value }
  }
}

function isEmptyRec(obj: unknown): boolean {
  if (isNil(obj)) {
    return true
  }

  if (isArray(obj)) {
    return obj.length === 0
  }

  if (typeof obj === 'object') {
    return !Object.getOwnPropertyNames(obj).some(item => {
      return !isEmptyRec((obj as Record<string, unknown>)[item])
    })
  }

  return isUndefined(obj)
}

function cleanUpObject(obj: object | null) {
  return omitBy(obj, value => {
    if (typeof value === 'object') {
      return isEmptyRec(value)
    }
    return isUndefined(value)
  })
}
