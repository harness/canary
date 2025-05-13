import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils'
import { Drawer as DrawerPrimitive } from 'vaul'

export const DrawerDescription = forwardRef<
  ElementRef<typeof DrawerPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn('cn-drawer-description', className)} {...props} />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName
