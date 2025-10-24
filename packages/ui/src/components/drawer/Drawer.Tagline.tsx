import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/utils'

export const DrawerTagline = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => <span className={cn('cn-drawer-tagline', className)} {...props} ref={ref} />
)
DrawerTagline.displayName = 'DrawerTagline'
