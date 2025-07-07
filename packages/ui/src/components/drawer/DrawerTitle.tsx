import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

export const DrawerTitle = forwardRef<
  ElementRef<typeof DrawerPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn('cn-drawer-title', className)} {...props} />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName
