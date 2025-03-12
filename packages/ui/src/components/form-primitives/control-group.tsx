import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

/**
 * A container component that groups form control elements together.
 * @example
 * <ControlGroup type="button">
 *   <Button>Button</Button>
 * </ControlGroup>
 */
export function ControlGroup({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative flex flex-col', className)} role="group" aria-label="Input control group" {...props}>
      {children}
    </div>
  )
}
