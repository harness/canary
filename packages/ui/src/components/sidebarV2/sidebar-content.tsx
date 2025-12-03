import { ComponentProps, forwardRef } from 'react'

import { ScrollArea } from '@/components'
import { cn } from '@utils/cn'

/**
 * SidebarV2 Content Component
 *
 * Scrollable content area for sidebar items
 */

export const SidebarV2Content = forwardRef<HTMLDivElement, ComponentProps<typeof ScrollArea>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="cn-sidebarv2-content-wrapper">
        <ScrollArea ref={ref} className={cn('cn-sidebarv2-content', className)} role="menu" {...props}>
          {children}
        </ScrollArea>
      </div>
    )
  }
)

SidebarV2Content.displayName = 'SidebarV2Content'
