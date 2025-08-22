import { ComponentProps, useEffect, useRef, useState } from 'react'

import { usePortal } from '@/context'
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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { portalContainer } = usePortal()

  // In case if drawer is opened via trigger, to track if any nested drawer is opened
  const [isTriggerOpen, setIsTriggerOpen] = useState(false)
  const { isParentOpen } = useDrawerContext()
  const nested = isParentOpen

  useEffect(() => {
    if (!portalContainer || portalContainer.querySelector('#vaul-style')) return

    const style = document.createElement('style')
    style.setAttribute('id', 'vaul-style')
    style.textContent = styleText

    portalContainer?.appendChild(style)
  }, [portalContainer])

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
    onOpenChange: (open: boolean) => {
      setIsTriggerOpen(open)
      onOpenChange?.(open)
    },
    ...(!nested && { open }),
    ...props
  }

  return (
    <DrawerContext.Provider
      value={{ direction, nested, isParentOpen: isParentOpen || open || isTriggerOpen, modal: props?.modal ?? true }}
    >
      <RootComponent handleOnly {...rootProps} container={portalContainer as HTMLElement} data-root="drawer">
        {nested && FakeTriggers}
        {children}
      </RootComponent>
    </DrawerContext.Provider>
  )
}
DrawerRoot.displayName = 'DrawerRoot'
