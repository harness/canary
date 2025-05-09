import { get, isArray, isEmpty, isObject, isString, isUndefined, omitBy } from 'lodash-es'

import { IInputTransformerFunc, IOutputTransformerFunc } from '../../types'

export function objectToArrayInputTransformer(): IInputTransformerFunc {
  return function (value: Record<string, unknown>, _values: Record<string, unknown>) {
    if (typeof value === 'undefined') return undefined
    if (!value) return { value }

    return {
      value: Object.getOwnPropertyNames(value).map(key => {
        return { key, value: value[key] }
      })
    }
  }
}

export function arrayToObjectOutputTransformer(options?: { unsetIfEmpty?: boolean }): IOutputTransformerFunc {
  return function (value: { key: string; value: unknown }[], _values: Record<string, unknown>) {
    if (typeof value === 'undefined') return undefined
    if (!value) return { value }

    const retObj = {
      value: value.reduce((acc, rowValue) => {
        return { ...acc, [rowValue.key]: rowValue.value }
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

    if (isObject(value)) {
      const cleanObj = omitBy(value, isUndefined)
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
    const parentStr = get(values, parentPath)

    if (typeof parentStr === 'string') {
      return { value: parentStr }
    }

    return { value }
  }
}

export function shorthandObjectOutputTransformer(parentPath: string): IOutputTransformerFunc {
  return function (value: unknown, values: Record<string, unknown>) {
    if (typeof value === 'undefined') return undefined
    if (!value) return { value }

    const parentObj = get(values, parentPath)

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
    if (typeof value === 'undefined') return undefined

    const parentStr = get(values, parentPath)

    if (typeof parentStr === 'string') {
      return { value: [parentStr] }
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
  if (typeof obj === 'object') {
    return !Object.getOwnPropertyNames(obj).some(item => {
      return !isEmptyRec((obj as Record<string, unknown>)[item])
    })
  } else {
    return isUndefined(obj)
  }
}

function cleanUpObject(obj: object | null) {
  return omitBy(obj, value => {
    if (typeof value === 'object') {
      return isEmptyRec(value)
    }
    return isUndefined(value)
  })
}
