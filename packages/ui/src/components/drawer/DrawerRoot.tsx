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
  // track actual drawer state from Vaul (required for trigger mode)
  const [internalOpen, setInternalOpen] = useState(false)
  const { isParentOpen, onChildOpenChange } = useDrawerContext()
  const nested = isParentOpen

  useEffect(() => {
    if (!portalContainer || portalContainer.querySelector('#vaul-style')) return

    const style = document.createElement('style')
    style.setAttribute('id', 'vaul-style')
    style.textContent = styleText

    portalContainer?.appendChild(style)
  }, [portalContainer])

  // Callback for child drawers to notify this drawer
  const handleChildOpenChange = useCallback((isOpen: boolean) => {
    setChildDrawerOpen(isOpen)
  }, [])

  // Track controlled `open` prop changes and notify parent
  useEffect(() => {
    // When controlled `open` prop changes, we need to notify parent
    // (wrappedOnOpenChange won't be called by Vaul in this case)
    if (open !== undefined && nested && onChildOpenChange) {
      onChildOpenChange(open)
    }
  }, [open, nested, onChildOpenChange])

  // Wrap user's onOpenChange to intercept all state changes (controlled and trigger mode)
  const wrappedOnOpenChange = useCallback(
    (isOpen: boolean) => {
      setInternalOpen(isOpen)

      // Notify parent drawer that our state changed
      if (nested && onChildOpenChange) {
        onChildOpenChange(isOpen)
      }

      // Call user's original callback
      onOpenChange?.(isOpen)
    },
    [nested, onChildOpenChange, onOpenChange]
  )

  const RootComponent = nested ? DrawerPrimitive.NestedRoot : DrawerPrimitive.Root

  const rootProps = useMemo(
    () => ({
      direction,
      open,
      ...props,
      onOpenChange: wrappedOnOpenChange
    }),
    [direction, open, props, wrappedOnOpenChange]
  )

  const contextValue = useMemo(
    () => ({
      direction,
      nested,
      // Use all three: parent state + controlled prop + trigger state
      isParentOpen: isParentOpen || open || internalOpen,
      hasOpenChild: childDrawerOpen,
      onChildOpenChange: handleChildOpenChange,
      modal: props?.modal ?? true
    }),
    [direction, nested, isParentOpen, open, internalOpen, childDrawerOpen, handleChildOpenChange, props?.modal]
  )

  return (
    <DrawerContext.Provider value={contextValue}>
      <DialogOpenContext.Provider value={{ open: open ?? internalOpen }}>
        <RootComponent handleOnly {...rootProps} container={portalContainer as HTMLElement} data-root="drawer">
          {children}
        </RootComponent>
      </DialogOpenContext.Provider>
    </DrawerContext.Provider>
  )
}
DrawerRoot.displayName = 'DrawerRoot'
