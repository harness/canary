import { ForwardedRef, MutableRefObject, RefCallback, useCallback } from 'react'

/**
 * Helps to construct conditional objects like this: {a: b, ...(some ? c : {}), z: x}
 */
export const wrapConditionalObjectElement = <T>(element: T, isPassing: boolean) => {
  if (!element || !isPassing) {
    return {} as T
  }

  return element
}

/**
 * Helps to construct conditional arrays like this: [item1, condition && item2, item3].filter(item => !!item)
 */
export const wrapConditionalArrayElements = <T>(elements: T[], isPassing: boolean) => {
  if (!elements || !isPassing) {
    return []
  }

  return elements
}

type PossibleRef<T> = MutableRefObject<T> | RefCallback<T> | ForwardedRef<T>

/**
 * A React hook that merges multiple refs into a single ref callback.
 */
export function useMergeRefs<T>(refs: Array<PossibleRef<T> | null | undefined>): RefCallback<T> {
  return useCallback(
    (value: T) => {
      refs.forEach(ref => {
        if (!ref) return

        if (typeof ref === 'function') {
          ref(value)
          return
        }

        try {
          ;(ref as MutableRefObject<T>).current = value
        } catch (error) {
          console.error('Failed to set ref value:', error)
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...refs]
  )
}
