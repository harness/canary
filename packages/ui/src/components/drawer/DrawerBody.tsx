import { PropsWithChildren } from 'react'

import { ScrollArea, ScrollAreaProps } from '@/components'
import { cn } from '@/utils'

export const DrawerBody = ({
  children,
  className,
  scrollAreaProps
}: PropsWithChildren<{ className?: string; scrollAreaProps?: ScrollAreaProps }>) => (
  <div className={cn('cn-drawer-body-wrap', className)}>
    <ScrollArea {...scrollAreaProps} className={cn('cn-drawer-body', scrollAreaProps?.className)}>
      {children}
    </ScrollArea>
  </div>
)
DrawerBody.displayName = 'DrawerBody'
