import { forwardRef, HTMLAttributes, ReactNode, useEffect, useState } from 'react'

import { MarkdownViewer, MarkdownViewerProps } from '@components/markdown-viewer'
import { Text, TextProps } from '@components/text'
import { cn } from '@utils/cn'

export interface MessageBubbleRootProps extends HTMLAttributes<HTMLDivElement> {
  role?: 'user' | 'assistant'
  children: ReactNode
}

const MessageBubbleRoot = forwardRef<HTMLDivElement, MessageBubbleRootProps>(
  ({ className, children, role, ...props }, ref) => (
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
)

MessageBubbleRoot.displayName = 'MessageBubbleRoot'

export interface MessageBubbleFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

const MessageBubbleFooter = forwardRef<HTMLDivElement, MessageBubbleFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('cn-message-bubble-footer', className)} {...props}>
      {children}
    </div>
  )
)

MessageBubbleFooter.displayName = 'MessageBubbleFooter'

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

export interface MessageBubbleTextProps extends Omit<TextProps, 'ref'> {
  speed?: number
}

const MessageBubbleText = ({ children, ...props }: MessageBubbleTextProps) => {
  const isTypewriterEffect = props.speed && typeof children === 'string'

  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isTypewriterEffect && currentIndex < children.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + children[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, props.speed)
      return () => clearTimeout(timeout)
    }
  }, [isTypewriterEffect, currentIndex, children, props.speed])

  return (
    <Text variant="body-normal" {...props}>
      {isTypewriterEffect ? displayedText : children}
    </Text>
  )
}

MessageBubbleText.displayName = 'MessageBubbleText'

export interface MessageBubbleMarkdownProps extends Omit<MarkdownViewerProps, 'source'> {
  children: string
}

const MessageBubbleMarkdown = ({ children, className, ...props }: MessageBubbleMarkdownProps) => {
  return (
    <MarkdownViewer variant="sm" markdownClassName={cn('bg-transparent', className)} source={children} {...props} />
  )
}

MessageBubbleMarkdown.displayName = 'MessageBubbleMarkdown'

export const MessageBubble = {
  Root: MessageBubbleRoot,
  Content: MessageBubbleContent,
  Text: MessageBubbleText,
  Markdown: MessageBubbleMarkdown,
  Footer: MessageBubbleFooter
}
