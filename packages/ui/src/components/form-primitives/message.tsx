import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

import { MessageTheme } from './form-primitives.types'

interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  theme: MessageTheme
}

const themeClassMap: Record<MessageTheme, string> = {
  [MessageTheme.SUCCESS]: 'text-success',
  [MessageTheme.WARNING]: 'text-warning',
  [MessageTheme.ERROR]: 'text-foreground-danger',
  [MessageTheme.DEFAULT]: 'text-tertiary-background'
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
  const role = theme === MessageTheme.ERROR ? 'alert' : 'status'
  const ariaLive = theme === MessageTheme.ERROR ? 'assertive' : 'polite'

  return (
    <p className={cn('text-sm font-normal', themeClassMap[theme], className)} role={role} aria-live={ariaLive}>
      {children}
    </p>
  )
}
