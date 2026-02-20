import { capitalize, forOwn, isNull, isUndefined } from 'lodash-es'

export function isChildrenEmpty(obj: { [key: string]: unknown }): boolean {
  let empty = true
  forOwn(obj, val => {
    empty = empty && (val === '' || isNull(val) || isUndefined(val))
  })

  return empty
}

export const generateReadableLabel = (name = ''): string => {
  return capitalize(name.split('_').join(' '))
}

export const afterFrames = (cb: () => void, frames = 2, mountTime?: number, immediateMs = 1000) => {
  let cancelled = false
  const step = () => {
    requestAnimationFrame(() => {
      if (cancelled) return
      frames -= 1
      frames <= 0 ? cb() : step()
    })
  }

  // If mountTime provided, check if we should call immediately
  if (mountTime) {
    const timeSinceMount = Date.now() - mountTime
    if (timeSinceMount <= immediateMs) {
      // First immediateMs: call immediately for performance
      cb()
      return () => {} // Return empty cancel function
    }
  }

  step()
  return () => {
    cancelled = true
  }
}
