import { ElementType, forwardRef, HTMLAttributes, ReactNode, useCallback, useState } from 'react'

import { cn } from '@/utils'

import { DrawerBody } from './DrawerBody'

export type DrawerRailShellProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  as: 'aside' | 'nav'
  'aria-label'?: string
  title?: ReactNode
  children: ReactNode
}

export const DrawerRailShell = forwardRef<HTMLElement, DrawerRailShellProps>(
  ({ as, className, title, 'aria-label': ariaLabel, children, ...props }, ref) => {
    const [isAtTop, setIsAtTop] = useState(true)

    const handleScrollTop = useCallback((entry: IntersectionObserverEntry) => {
      setIsAtTop(entry.isIntersecting)
    }, [])

    const Component = as as ElementType

    return (
      <Component ref={ref} className={cn('cn-drawer-dual-pane-rail', className)} aria-label={ariaLabel} {...props}>
        {title ? (
          <div
            className={cn('cn-drawer-dual-pane-rail-header', {
              'cn-drawer-dual-pane-rail-header-at-top': isAtTop
            })}
          >
            <h2 className="cn-drawer-dual-pane-rail-header-title">{title}</h2>
          </div>
        ) : null}
        <DrawerBody
          className="cn-drawer-dual-pane-rail-body"
          classNameContent="cn-drawer-dual-pane-rail-content"
          onScrollTop={handleScrollTop}
        >
          {children}
        </DrawerBody>
      </Component>
    )
  }
)
DrawerRailShell.displayName = 'DrawerRailShell'
