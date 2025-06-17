import { PropsWithChildren } from 'react'

import { ScrollArea } from '@/components'
import { cn } from '@/utils'

export const DrawerBody = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <div className={cn('cn-drawer-body-wrap', className)}>
    <ScrollArea className={cn('cn-drawer-body', className)}>{children}</ScrollArea>
  </div>
)
DrawerBody.displayName = 'DrawerBody'
