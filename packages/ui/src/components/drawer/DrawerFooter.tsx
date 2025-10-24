import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/utils'

export const DrawerFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div className={cn('cn-drawer-footer', className)} ref={ref} {...props} />
)
DrawerFooter.displayName = 'DrawerFooter'
