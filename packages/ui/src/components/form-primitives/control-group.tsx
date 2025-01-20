import { HTMLAttributes } from 'react'

import { cn } from '@utils/cn'

interface ControlGroupProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'button' | 'input'
}

/**
 * A container component that groups form control elements together.
 * @example
 * <ControlGroup type="button">
 *   <Button>Button</Button>
 * </ControlGroup>
 */
export function ControlGroup({ children, type, className, ...props }: ControlGroupProps) {
  return (
    <div
      className={cn('relative flex flex-col', { '': type === 'button' }, className)}
      role="group"
      aria-label={type === 'button' ? 'Button control group' : 'Input control group'}
      {...props}
    >
      {children}
    </div>
  )
}
