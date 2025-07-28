import { ComponentPropsWithoutRef, createContext, useContext } from 'react'

import { Drawer as DrawerPrimitive } from 'vaul'

type DrawerRootProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Root>

type DrawerContextType = Pick<DrawerRootProps, 'direction' | 'nested' | 'modal'> & {
  isParentOpen?: boolean
}

export const DrawerContext = createContext<DrawerContextType>({
  direction: 'right',
  isParentOpen: false
})

export const useDrawerContext = () => {
  return useContext(DrawerContext)
}
