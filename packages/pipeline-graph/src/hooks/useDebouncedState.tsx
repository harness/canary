import { useCallback, useRef, useState } from 'react'

export function useDebouncedState<T>(initial: T, delay = 300) {
  const [state, setState] = useState(initial)
  const timeout = useRef<number>()

  const setDebounced = useCallback(
    (value: T) => {
      clearTimeout(timeout.current)
      timeout.current = window.setTimeout(() => {
        setState(value)
      }, delay)
    },
    [delay]
  )

  return [state, setDebounced] as const
}
