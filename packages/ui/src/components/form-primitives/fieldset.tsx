import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {
  box?: boolean
  shaded?: boolean
}

/**
 * A form fieldset component that groups related form elements.
 * @example
 * <Fieldset box shaded>
 *   <div>Form elements</div>
 * </Fieldset>
 */
export function Fieldset({ children, box, shaded, className, ...props }: FieldsetProps) {
  return (
    <fieldset
      className={cn(
        'flex flex-col gap-y-7',
        { 'rounded-md border px-5 py-3.5 pb-5': box, 'bg-cn-background-accent/[0.02]': shaded },
        className
      )}
      role="group"
      aria-describedby="fieldset-description"
      {...props}
    >
      {children}
    </fieldset>
  )
}
