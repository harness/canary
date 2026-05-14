import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { DrawerRailShell } from './DrawerRailShell'

export type DrawerRailProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  'aria-label'?: string
  title?: ReactNode
  children: ReactNode
}

export const DrawerRail = forwardRef<HTMLElement, DrawerRailProps>(
  ({ className, title, 'aria-label': ariaLabel, children, ...props }, ref) => (
    <DrawerRailShell ref={ref} as="aside" className={className} title={title} aria-label={ariaLabel} {...props}>
      {children}
    </DrawerRailShell>
  )
)
DrawerRail.displayName = 'DrawerRail'
