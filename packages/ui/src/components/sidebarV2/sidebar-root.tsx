import { forwardRef } from 'react'

import { useSidebar } from '@components/sidebar/sidebar-context'
import { cn } from '@utils/cn'

import { SidebarV2RootProps } from './types'

export type { SidebarV2RootProps } from './types'

/**
 * SidebarV2 Root Component
 *
 * Main container for the sidebar
 */

export const SidebarV2Root = forwardRef<HTMLDivElement, SidebarV2RootProps>(
  ({ className, children, ...props }, ref) => {
    const { state } = useSidebar()

    return (
      <div ref={ref} className={cn('cn-sidebarv2', className)} data-state={state} {...props}>
        {children}
      </div>
    )
  }
)

SidebarV2Root.displayName = 'SidebarV2Root'
