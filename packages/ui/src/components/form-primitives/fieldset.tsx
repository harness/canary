import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {
  box?: boolean
  shaded?: boolean
  /**
   * For better accessibility, the fieldset should start from the legend element
   */
  legend?: string
}

/**
 * A form fieldset component that groups related form elements.
 * @example
 * <Fieldset box shaded legend="Some Information">
 *   <div>Form elements</div>
 * </Fieldset>
 */
export function Fieldset({ children, box, shaded, className, legend, ...props }: FieldsetProps) {
  return (
    <fieldset
      className={cn(
        'flex flex-col gap-y-7',
        { 'rounded-md border px-5 py-3.5 pb-5': box, 'bg-primary/[0.02]': shaded },
        className
      )}
      {...props}
    >
      <legend className="sr-only">{legend}</legend>

      {children}
    </fieldset>
  )
}
