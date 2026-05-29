import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/utils'

import { Layout } from '../layout'
import { DrawerDualPaneProvider } from './drawer-dual-pane-context'

export type DrawerDualPaneProps = HTMLAttributes<HTMLDivElement> & {
  value?: string
  onValueChange?: (value: string) => void
}

export const DrawerDualPane = forwardRef<HTMLDivElement, DrawerDualPaneProps>(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    const content = (
      <Layout.Horizontal ref={ref} gap="none" className={cn('cn-drawer-dual-pane', className)} {...props}>
        {children}
      </Layout.Horizontal>
    )

    if (value === undefined) {
      return content
    }

    return (
      <DrawerDualPaneProvider value={value} onValueChange={onValueChange}>
        {content}
      </DrawerDualPaneProvider>
    )
  }
)
DrawerDualPane.displayName = 'DrawerDualPane'
