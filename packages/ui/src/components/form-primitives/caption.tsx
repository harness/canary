import { PropsWithChildren } from 'react'

import { Text } from '@components/text'
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
    <Text as="span" color="foreground-2" className={cn('mt-cn-3xs', className)}>
      {children}
    </Text>
  )
}
