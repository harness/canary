import { ComponentProps, useEffect, useRef } from 'react'

import { Drawer as DrawerPrimitive } from 'vaul'

import { DrawerContext } from './drawer-context'

export const DrawerRoot = ({
  nested = false,
  direction = 'right',
  open,
  children,
  onOpenChange,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!nested) return

    if (open && triggerRef.current) {
      triggerRef.current.click()
    }

    if (!open && closeRef.current) {
      closeRef.current.click()
    }
  }, [nested, open])

  const FakeTriggers = (
    <>
      <DrawerPrimitive.Trigger asChild>
        <button className="sr-only" ref={triggerRef} aria-hidden="true" tabIndex={-1} />
      </DrawerPrimitive.Trigger>
      <DrawerPrimitive.Close asChild>
        <button className="sr-only" ref={closeRef} aria-hidden="true" tabIndex={-1} />
      </DrawerPrimitive.Close>
    </>
  )

  const RootComponent = nested ? DrawerPrimitive.NestedRoot : DrawerPrimitive.Root

  const rootProps = {
    direction,
    onOpenChange,
    ...(!nested && { open }),
    ...props
  }

  return (
    <DrawerContext.Provider value={{ direction, nested }}>
      <RootComponent {...rootProps}>
        {nested && FakeTriggers}
        {children}
      </RootComponent>
    </DrawerContext.Provider>
  )
}
DrawerRoot.displayName = 'DrawerRoot'
