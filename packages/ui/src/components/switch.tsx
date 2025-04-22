import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils/cn'
import * as SwitchPrimitives from '@radix-ui/react-switch'

const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitives.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    label?: string
    description?: string
  }
>(({ className, label, description, ...props }, ref) => (
  <div className="switch-wrapper">
    <SwitchPrimitives.Root className={cn('switch-root', className)} {...props} ref={ref}>
      <SwitchPrimitives.Thumb className="switch-thumb" />
    </SwitchPrimitives.Root>
    {(label || description) && (
      <div className="switch-label-wrapper">
        <label className="switch-label">{(props.required ? `${label} *` : label) || ''}</label>
        <label className="switch-description">{description || ''}</label>
      </div>
    )}
  </div>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
