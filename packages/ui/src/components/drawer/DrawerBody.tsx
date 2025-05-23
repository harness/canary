import { PropsWithChildren } from 'react'

import { ScrollArea } from '@/components'
import { cn } from '@/utils'

export const DrawerBody = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <ScrollArea className="flex-1" viewportClassName={cn('cn-drawer-body', className)}>
    {children}
  </ScrollArea>
)
DrawerBody.displayName = 'DrawerBody'
