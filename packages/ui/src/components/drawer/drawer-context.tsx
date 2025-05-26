import { ComponentPropsWithoutRef, createContext, useContext } from 'react'

import { Drawer as DrawerPrimitive } from 'vaul'

type DrawerRootProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>

type DrawerContextType = Pick<DrawerRootProps, 'direction' | 'nested'>

export const DrawerContext = createContext<DrawerContextType>({
  direction: 'right'
})

export const useDrawerContext = () => {
  const ctx = useContext(DrawerContext)

  if (!ctx) {
    throw new Error('useDrawerContext must be used within <Drawer.Root>')
  }

  return ctx
}
