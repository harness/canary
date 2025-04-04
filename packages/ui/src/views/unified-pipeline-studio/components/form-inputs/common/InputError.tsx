import { forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { cn } from '@utils/cn'

const InputError = forwardRef<HTMLParagraphElement, { path: string } & React.HTMLAttributes<HTMLParagraphElement>>(
  ({ path, className, ...props }, ref) => {
    const { getFieldState, formState } = useFormContext()

    const fieldState = getFieldState(path, formState)
    const { error } = fieldState

    if (!error?.message) {
      return null
    }

    return (
      <p ref={ref} className={cn('text-cn-foreground-danger text-sm font-medium', className)} {...props}>
        {error.message}
      </p>
    )
  }
)
InputError.displayName = 'InputError'

export { InputError }
