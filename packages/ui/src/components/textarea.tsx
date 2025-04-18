import { forwardRef, ReactNode, TextareaHTMLAttributes } from 'react'

import { Caption, ControlGroup, Label, Message, MessageTheme } from '@/components'
import { cn } from '@utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  caption?: ReactNode
  error?: string
  optional?: boolean
  resizable?: boolean
}

/**
 * A forward-ref Textarea component with support for labels, captions, and error messages.
 * @example
 * <Textarea name="textarea" label="Textarea" placeholder="Enter text here" />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, disabled, label, caption, error, optional, className, resizable = false, ...props }, ref) => {
    return (
      <ControlGroup>
        {label && (
          <Label className="mb-2" disabled={disabled} optional={optional} htmlFor={id}>
            {label}
          </Label>
        )}
        <textarea
          className={cn(
            'placeholder:text-cn-foreground-3 flex min-h-[74px] w-full rounded border bg-cn-background-2 px-3 py-2 text-sm focus-visible:outline-none focus-visible:rounded disabled:cursor-not-allowed',
            resizable ? 'resize-y [field-sizing:content] whitespace-pre-wrap [word-break:break-word]' : 'resize-none',
            className,
            error
              ? 'border-cn-borders-danger'
              : 'border-cn-borders-2 focus-visible:border-cn-borders-1 disabled:placeholder:text-cn-foreground-disabled disabled:border-cn-borders-disabled'
          )}
          id={id}
          disabled={disabled}
          ref={ref}
          {...props}
        />
        {error && (
          <Message className="mt-0.5" theme={MessageTheme.ERROR}>
            {error}
          </Message>
        )}
        {caption && <Caption className={cn({ 'text-cn-foreground-disabled': disabled })}>{caption}</Caption>}
      </ControlGroup>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
