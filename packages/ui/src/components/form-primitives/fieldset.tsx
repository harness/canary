import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {}

/**
 * A form fieldset component that groups related form elements.
 * @example
 * <Fieldset>
 *   <div>Form elements</div>
 * </Fieldset>
 */
export function Fieldset({ children, className, ...props }: FieldsetProps) {
  return (
    <fieldset
      className={cn('flex flex-col gap-y-6', className)}
      role="group"
      aria-describedby="fieldset-description"
      {...props}
    >
      {children}
    </fieldset>
  )
}
