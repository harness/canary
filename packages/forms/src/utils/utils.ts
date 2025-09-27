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

export const afterFrames = (cb: () => void, frames = 2) => {
  let cancelled = false
  const step = () => {
    requestAnimationFrame(() => {
      if (cancelled) return
      frames -= 1
      frames <= 0 ? cb() : step()
    })
  }
  step()
  return () => {
    cancelled = true
  }
}
