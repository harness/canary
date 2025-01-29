import { PropsWithChildren } from 'react'

import { Text } from '@/components'
import { cn } from '@utils/cn'

interface CaptionProps extends PropsWithChildren<React.HTMLAttributes<HTMLElement>> {
  className?: string
}

/**
 * Caption component that renders supplementary text below form inputs.
 * Used to provide additional context or hints for form fields.
 * @example
 * <Caption>This is a caption</Caption>
 */
export function Caption({ children, className }: CaptionProps) {
  return (
    <Text className={cn('text-foreground-4 mt-1 leading-snug', className)} size={2}>
      {children}
    </Text>
  )
}
