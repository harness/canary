import { useCallback, useLayoutEffect, type RefObject } from 'react'

export function useResizeObserver<T extends Element>(ref: RefObject<T>, callback: (element: T) => void) {
  const fn = useCallback(() => callback(ref.current as T), [callback, ref])

  useLayoutEffect(() => {
    let taskId = 0
    const dom = ref.current as T

    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(taskId)
      taskId = requestAnimationFrame(fn)
    })

    resizeObserver.observe(dom)

    return () => {
      cancelAnimationFrame(taskId)
      resizeObserver.unobserve(dom)
    }
  }, [ref, callback, fn])
}
