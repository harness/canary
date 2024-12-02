import { forwardRef, TextareaHTMLAttributes } from 'react'

import { cn } from '@utils/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'border-borders-2 placeholder:text-foreground-4 flex min-h-[60px] w-full rounded border bg-transparent px-3 py-2 text-14 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
