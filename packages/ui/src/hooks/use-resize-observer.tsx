import { useCallback, useLayoutEffect, type RefObject } from 'react'

import { throttle } from 'lodash-es'

export function useResizeObserver<T extends Element>(
  ref: RefObject<T>,
  callback: (element: T) => void,
  throttleMs = 100
) {
  const throttledCallback = useCallback(
    throttle((element: T) => {
      if (document.hidden) return // Don't process when tab is hidden
      callback(element)
    }, throttleMs),
    [callback, throttleMs]
  )

  useLayoutEffect(() => {
    let taskId = 0
    const dom = ref.current as T

    if (!dom) return

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(taskId)
      taskId = requestAnimationFrame(() => throttledCallback(dom))
    })

    resizeObserver.observe(dom)

    return () => {
      cancelAnimationFrame(taskId)
      resizeObserver.disconnect()
      throttledCallback.cancel()
    }
  }, [ref, throttledCallback])
}
