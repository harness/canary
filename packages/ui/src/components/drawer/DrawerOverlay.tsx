import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

import { useDrawerContext } from './drawer-context'

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DrawerPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { nested } = useDrawerContext()

  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn('cn-drawer-backdrop', { 'cn-drawer-backdrop-nested': nested }, className)}
      {...props}
    />
  )
})
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName
