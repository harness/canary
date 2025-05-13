import { HTMLAttributes } from 'react'

import { cn } from '@/utils'

export const DrawerTagline = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn('cn-drawer-tagline', className)} {...props} />
)
DrawerTagline.displayName = 'DrawerTagline'
