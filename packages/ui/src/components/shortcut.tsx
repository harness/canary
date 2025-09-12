import { forwardRef, PropsWithoutRef } from 'react'

import { Text, TextProps } from '@/components'
import { cn } from '@utils/cn'

export type ShortcutProps = PropsWithoutRef<TextProps>

export const Shortcut = forwardRef<HTMLElement, ShortcutProps>(({ children, className, ...props }, ref) => {
  return (
    <Text ref={ref} variant="caption-light" className={cn('cn-shortcut', className)} {...props}>
      {children}
    </Text>
  )
})
Shortcut.displayName = 'Shortcut'
