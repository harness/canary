import { isValidElement, ReactNode } from 'react'

export const getComponentDisplayName = (child: ReactNode): string | undefined => {
  if (isValidElement(child)) {
    const type = child.type

    if (typeof type !== 'string') {
      return (type as { displayName?: string }).displayName
    }
  }

  return undefined
}
