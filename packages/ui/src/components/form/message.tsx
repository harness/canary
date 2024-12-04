import { HTMLAttributes } from 'react'

import { Text } from '@/components'
import { cn } from '@utils/cn'

export enum MessageTheme {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DEFAULT = 'default'
}

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
  const textClass = themeClassMap[theme]
  const role = theme === MessageTheme.ERROR ? 'alert' : 'status'
  const ariaLive = theme === MessageTheme.ERROR ? 'assertive' : 'polite'

  return (
    <div className={cn(textClass, className)} role={role} aria-live={ariaLive}>
      <Text as="p" size={2} className="text-inherit">
        {children}
      </Text>
    </div>
  )
}
