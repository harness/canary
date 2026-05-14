import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/utils'

import { Layout } from '../layout'

export const DrawerDualPaneMain = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Layout.Vertical ref={ref} gap="none" className={cn('cn-drawer-dual-pane-main', className)} {...props} />
  )
)
DrawerDualPaneMain.displayName = 'DrawerDualPaneMain'
