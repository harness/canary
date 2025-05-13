import { ComponentProps } from 'react'

import { Drawer as DrawerPrimitive } from 'vaul'

import { DrawerContext } from './drawer-context'

export const DrawerRoot = ({
  nested = false,
  direction = 'right',
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => {
  return (
    <DrawerContext.Provider value={{ direction, nested }}>
      {nested ? (
        <DrawerPrimitive.NestedRoot direction={direction} {...props} />
      ) : (
        <DrawerPrimitive.Root direction={direction} {...props} />
      )}
    </DrawerContext.Provider>
  )
}
DrawerRoot.displayName = 'DrawerRoot'
