import { get, isArray, isEmpty, isNil, isNull, isObject, isPlainObject, isString, isUndefined, omitBy } from 'lodash-es'

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
  return function (value: { key: string; value: unknown }[], _values: Record<string, unknown>) {
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
  return function (value: unknown, _values: Record<string, unknown>) {
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
 */
export function unsetEmptyObjectOutputTransformer(path?: string): IOutputTransformerFunc {
  return function (inputValue: any, values: Record<string, any>) {
    const value = path ? get(values, path) : inputValue

    if (typeof value === 'undefined') return undefined

    if (isNull(value)) return { value: undefined, path }

    if (isObject(value)) {
      const cleanObj = omitBy(value, isNil)
      if (isEmpty(cleanObj)) {
        return { value: undefined, path }
      }
    }

    return { value, path }
  }
}

/**
 * unset property if it contains empty string
 */
export function unsetEmptyStringOutputTransformer(): IOutputTransformerFunc {
  return function (value: unknown, _values: Record<string, unknown>) {
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

/**
 * Collapses `{ parent: { [fieldKey]: value, ...empty siblings } }` into `{ parent: value }`
 * when `fieldKey` is the only meaningful sibling under `parent`.
 *
 * Pass `fieldKey` explicitly so the collapse decision does not depend on the order in which
 * sibling fields happen to be registered with React Hook Form.
 */
export function shorthandObjectOutputTransformer(parentPath: string, fieldKey?: string): IOutputTransformerFunc {
  return function (value: unknown, values: Record<string, unknown>) {
    if (typeof value === 'undefined') return undefined
    if (!value) return { value }

    const parentObj = get(values, parentPath)

    if (typeof parentObj === 'object' && parentObj !== null) {
      const cleanParentObj = cleanUpObject(parentObj)
      const keys = Object.keys(cleanParentObj)
      const shouldCollapse = fieldKey ? keys.length === 1 && keys[0] === fieldKey : keys.length === 1

      if (shouldCollapse) {
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
  if (Array.isArray(obj)) {
    return obj.every(item => isEmptyRec(item))
  }
  if (typeof obj === 'object' && obj !== null) {
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
