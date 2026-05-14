import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/utils'

import { Layout } from '../layout'

export const DrawerDualPane = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Layout.Horizontal ref={ref} gap="none" className={cn('cn-drawer-dual-pane', className)} {...props} />
  )
)
DrawerDualPane.displayName = 'DrawerDualPane'
