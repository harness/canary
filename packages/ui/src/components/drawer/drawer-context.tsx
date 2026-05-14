import { ComponentPropsWithoutRef, createContext, useContext } from 'react'

import { Drawer as DrawerPrimitive } from 'vaul'

type DrawerRootProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>

export const DRAWER_SIZE_ORDER = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const

export function getMaxDrawerSize(a?: string, b?: string): string | undefined {
  if (!a) return b
  if (!b) return a
  const aIdx = DRAWER_SIZE_ORDER.indexOf(a as (typeof DRAWER_SIZE_ORDER)[number])
  const bIdx = DRAWER_SIZE_ORDER.indexOf(b as (typeof DRAWER_SIZE_ORDER)[number])
  return aIdx >= bIdx ? a : b
}

export const DEFAULT_MAX_STACK_DEPTH = 7

type DrawerContextType = Pick<DrawerRootProps, 'direction' | 'nested' | 'modal'> & {
  isParentOpen?: boolean
  hasOpenChild?: boolean
  onChildOpenChange?: (isOpen: boolean) => void
  maxDescendantSize?: string
  onChildSubtreeMax?: (maxSize: string | undefined) => void
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
