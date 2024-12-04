import { forwardRef, ReactNode, TextareaHTMLAttributes } from 'react'

import { Caption, ControlGroup, Label, Message, MessageTheme } from '@/components'
import { cn } from '@utils/cn'

interface TextareaError {
  theme: MessageTheme
  message?: string
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  caption?: ReactNode
  error?: TextareaError
  optional?: boolean
}

/**
 * A forward-ref Textarea component with support for labels, captions, and error messages.
 * @example
 * <Textarea name="textarea" label="Textarea" placeholder="Enter text here" />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, disabled, label, caption, error, optional, className, ...props }, ref) => {
    return (
      <ControlGroup>
        {label && (
          <Label className="mb-2.5" color={disabled ? 'disabled-dark' : 'secondary'} optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}
        <textarea
          className={cn(
            'placeholder:text-foreground-4 flex min-h-[74px] w-full rounded border bg-transparent px-3 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:rounded disabled:cursor-not-allowed resize-none',
            className,
            error
              ? 'border-borders-danger'
              : 'border-borders-2 focus-visible:border-borders-3 disabled:placeholder:text-foreground-9 disabled:border-borders-1'
          )}
          id={id}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {error && (
          <Message className={cn(caption ? 'mt-1' : 'absolute top-full translate-y-1')} theme={error.theme}>
            {error.message}
          </Message>
        )}
        {caption && <Caption>{caption}</Caption>}
      </ControlGroup>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
