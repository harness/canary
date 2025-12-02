import { forwardRef, HTMLAttributes, ReactNode } from 'react'

import { MarkdownViewer, MarkdownViewerProps } from '@components/markdown-viewer'
import { Text, TextProps } from '@components/text'
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

export interface MessageBubbleTextProps extends Omit<TextProps, 'ref'> {}

const MessageBubbleText = ({ children, ...props }: MessageBubbleTextProps) => {
  return (
    <Text variant="body-normal" {...props}>
      {children}
    </Text>
  )
}

MessageBubbleText.displayName = 'MessageBubbleText'

export interface MessageBubbleMarkdownProps extends Omit<MarkdownViewerProps, 'source'> {
  children: string
}

const MessageBubbleMarkdown = ({ children, className, ...props }: MessageBubbleMarkdownProps) => {
  return <MarkdownViewer variant="sm" className={cn('bg-transparent', className)} source={children} {...props} />
}

MessageBubbleMarkdown.displayName = 'MessageBubbleMarkdown'

export const MessageBubble = {
  Root: MessageBubbleRoot,
  Content: MessageBubbleContent,
  Text: MessageBubbleText,
  Markdown: MessageBubbleMarkdown
}
