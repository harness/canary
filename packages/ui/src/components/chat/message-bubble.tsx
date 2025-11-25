import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { cn } from '@utils/cn'

export interface MessageBubbleRootProps extends HTMLAttributes<HTMLDivElement> {
  role?: 'user' | 'assistant'
  children: ReactNode
}

const MessageBubbleRoot = forwardRef<HTMLDivElement, MessageBubbleRootProps>(
  ({ className, children, role, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'cn-message-bubble',
          { 'cn-message-bubble-user': role === 'user', 'cn-message-bubble-assistant': role === 'assistant' },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MessageBubbleRoot.displayName = 'MessageBubbleRoot'

export interface MessageBubbleContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const MessageBubbleContent = forwardRef<HTMLDivElement, MessageBubbleContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('cn-message-bubble-content', className)} {...props}>
        {children}
      </div>
    )
  }
)

MessageBubbleContent.displayName = 'MessageBubbleContent'

export const MessageBubble = {
  Root: MessageBubbleRoot,
  Content: MessageBubbleContent
}
