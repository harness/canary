import { ComponentProps, useCallback, useEffect, useMemo, useState } from 'react'

import { DialogOpenContext, usePortal } from '@/context'
import { Drawer as DrawerPrimitive } from 'vaul'
import styleText from 'vaul/style.css?raw'

import { DrawerContext, useDrawerContext } from './drawer-context'

export const DrawerRoot = ({
  direction = 'right',
  open,
  children,
  onOpenChange,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => {
  const { portalContainer } = usePortal()

  const [childDrawerOpen, setChildDrawerOpen] = useState(false)
  const { isParentOpen, onChildOpenChange } = useDrawerContext()
  const nested = isParentOpen

  useEffect(() => {
    if (!portalContainer || portalContainer.querySelector('#vaul-style')) return

    const style = document.createElement('style')
    style.setAttribute('id', 'vaul-style')
    style.textContent = styleText

    portalContainer?.appendChild(style)
  }, [portalContainer])

  // Notify parent when this drawer's open state changes
  useEffect(() => {
    if (nested && onChildOpenChange) {
      onChildOpenChange(open || false)
    }
  }, [nested, open, onChildOpenChange])

  // Callback for child drawers to notify this drawer
  const handleChildOpenChange = useCallback((isOpen: boolean) => {
    setChildDrawerOpen(isOpen)
  }, [])

  const RootComponent = nested ? DrawerPrimitive.NestedRoot : DrawerPrimitive.Root

  const rootProps = useMemo(
    () => ({
      direction,
      onOpenChange,
      open,
      ...props
    }),
    [direction, onOpenChange, open, props]
  )

  const contextValue = useMemo(
    () => ({
      direction,
      nested,
      isParentOpen: isParentOpen || open,
      hasOpenChild: childDrawerOpen,
      onChildOpenChange: handleChildOpenChange,
      modal: props?.modal ?? true
    }),
    [direction, nested, isParentOpen, open, childDrawerOpen, handleChildOpenChange, props?.modal]
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DialogOpenContext.Provider value={{ open }}>
        <RootComponent handleOnly {...rootProps} container={portalContainer as HTMLElement} data-root="drawer">
          {children}
        </RootComponent>
      </DialogOpenContext.Provider>
    </DrawerContext.Provider>
  )
}
DrawerRoot.displayName = 'DrawerRoot'
