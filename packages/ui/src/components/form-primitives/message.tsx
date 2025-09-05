import { HTMLAttributes } from 'react'

import { Text } from '@/components'
import { cn } from '@utils/cn'

import { MessageTheme } from './form-primitives.types'

interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  theme: MessageTheme
}

const themeClassMap: Record<MessageTheme, string> = {
  [MessageTheme.SUCCESS]: 'text-cn-success',
  [MessageTheme.WARNING]: 'text-cn-warning',
  [MessageTheme.ERROR]: 'text-cn-danger',
  [MessageTheme.DEFAULT]: 'text-cn-3'
}

/**
 * Message component for displaying status or error messages with different themes.
 * This component is typically used in forms to provide feedback to users, such as success, warning, or error messages.
 *
 * @example
 * <Message theme={MessageTheme.ERROR}>
 *   This field is required
 * </Message>
 *
 * <Message theme={MessageTheme.SUCCESS}>
 *   Changes saved successfully
 * </Message>
 */
export function Message({ children, theme, className }: MessageProps) {
  const textClass = themeClassMap[theme]
  const role = theme === MessageTheme.ERROR ? 'alert' : 'status'
  const ariaLive = theme === MessageTheme.ERROR ? 'assertive' : 'polite'

  return (
    <div className={cn(textClass, className)} role={role} aria-live={ariaLive}>
      <Text color="inherit">{children}</Text>
    </div>
  )
}
