import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { useDrawerContext } from './drawer-context'

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & { withCustomOverlay?: boolean }
>(({ className, withCustomOverlay = false, ...props }, ref) => {
  const { nested, isParentOpen } = useDrawerContext()

  if (withCustomOverlay) {
    return (
      <DrawerPrimitive.Close asChild>
        <div
          className={cn('cn-drawer-backdrop', className)}
          {...props}
          data-vaul-overlay
          data-state={isParentOpen ? 'open' : 'closed'}
          data-vaul-snap-points-overlay={isParentOpen}
          data-aria-hidden="true"
          aria-hidden="true"
        />
      </DrawerPrimitive.Close>
    )
  }

  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn('cn-drawer-backdrop', { 'cn-drawer-backdrop-nested': nested }, className)}
      {...props}
    />
  )
})
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName
