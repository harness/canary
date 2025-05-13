import { HTMLAttributes } from 'react'

import { cn } from '@/utils'

export const DrawerFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('cn-drawer-footer', className)} {...props} />
)
DrawerFooter.displayName = 'DrawerFooter'
