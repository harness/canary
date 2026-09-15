import { forwardRef, PropsWithChildren } from 'react'

import { Text } from '@/components'
import { cn } from '@utils/cn'

export interface AlertItemDescriptionProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  className?: string
}

export const AlertItemDescription = forwardRef<HTMLDivElement, AlertItemDescriptionProps>(
  ({ className, children }, ref) => (
    <Text
      ref={ref}
      as="div"
      variant="body-normal"
      color="foreground-3"
      truncate
      className={cn('cn-alert-item-description', className)}
    >
      {children}
    </Text>
  )
)

AlertItemDescription.displayName = 'AlertItemDescription'
