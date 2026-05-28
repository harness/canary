import { ComponentPropsWithoutRef, createContext, useContext } from 'react'

import { Drawer as DrawerPrimitive } from 'vaul'

type DrawerRootProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>

export const DRAWER_SIZE_ORDER = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const

export const DEFAULT_MAX_STACK_DEPTH = 7

type DrawerContextType = Pick<DrawerRootProps, 'direction' | 'nested' | 'modal'> & {
  isParentOpen?: boolean
  hasOpenChild?: boolean
  onChildOpenChange?: (isOpen: boolean) => void
  topmostDescendantSize?: string
  onTopmostSizeChange?: (size: string | undefined) => void
  reportContentSize?: (size: string) => void
  openDescendantCount?: number
  onChildDescendantCount?: (count: number) => void
  stackDepth?: number
  maxStackDepth?: number
}

export const DrawerContext = createContext<DrawerContextType>({
  direction: 'right',
  isParentOpen: false
})

export const useDrawerContext = () => {
  return useContext(DrawerContext)
}
