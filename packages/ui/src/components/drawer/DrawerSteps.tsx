import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { DrawerDualPaneProvider } from './drawer-dual-pane-context'
import { DrawerRailShell } from './DrawerRailShell'

export type DrawerStepsProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  value: string
  onValueChange?: (value: string) => void
  'aria-label'?: string
  title?: ReactNode
  children: ReactNode
}

export const DrawerSteps = forwardRef<HTMLElement, DrawerStepsProps>(
  ({ className, value, onValueChange, children, title, 'aria-label': ariaLabel = 'Drawer steps', ...props }, ref) => (
    <DrawerDualPaneProvider value={value} onValueChange={onValueChange}>
      <DrawerRailShell ref={ref} as="nav" className={className} title={title} aria-label={ariaLabel} {...props}>
        <ol className="cn-drawer-dual-pane-steps-list">{children}</ol>
      </DrawerRailShell>
    </DrawerDualPaneProvider>
  )
)
DrawerSteps.displayName = 'DrawerSteps'
