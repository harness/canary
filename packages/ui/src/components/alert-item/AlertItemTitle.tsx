import { forwardRef, PropsWithChildren } from 'react'

import { Text } from '@/components'
import { cn } from '@utils/cn'

export interface AlertItemTitleProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  className?: string
}

export const AlertItemTitle = forwardRef<HTMLDivElement, AlertItemTitleProps>(({ className, children }, ref) => {
  return (
    <Text ref={ref} variant="body-strong" color="foreground-1" truncate className={cn('flex-1 min-w-0', className)}>
      {children}
    </Text>
  )
})

AlertItemTitle.displayName = 'AlertItemTitle'
