import { PropsWithChildren } from 'react'

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
  return <span className={cn('text-cn-2 mt-cn-3xs leading-snug text-sm', className)}>{children}</span>
}
