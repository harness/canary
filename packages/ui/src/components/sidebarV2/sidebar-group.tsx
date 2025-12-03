import { forwardRef } from 'react'

import { SidebarV2GroupProps, useSidebar } from '@/components'
import { cn } from '@utils/cn'

export const SidebarV2Group = forwardRef<HTMLDivElement, SidebarV2GroupProps>(
  ({ className, label, children, ...props }, ref) => {
    const { state } = useSidebar()
    const collapsed = state === 'collapsed'

    return (
      <div ref={ref} className={cn('cn-sidebarv2-group', className)} {...props}>
        {label && !collapsed && <div className="cn-sidebarv2-group-label">{label}</div>}
        {children}
      </div>
    )
  }
)

SidebarV2Group.displayName = 'SidebarV2Group'
