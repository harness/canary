import { ComponentProps, ElementRef, forwardRef } from 'react'

import { Separator } from '@/components'
import { cn } from '@utils/cn'

/**
 * SidebarV2 Separator Component
 */

export const SidebarV2Separator = forwardRef<ElementRef<typeof Separator>, ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => (
    <Separator ref={ref} className={cn('cn-sidebarv2-separator', className)} {...props} />
  )
)

SidebarV2Separator.displayName = 'SidebarV2Separator'
