import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils/cn'
import * as SwitchPrimitives from '@radix-ui/react-switch'

const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitives.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    label?: string
    description?: string
  }
>(({ className, label, description, ...props }, ref) => {
  const switchId = `switch-${Math.random().toString(36).slice(2, 11)}`
  return (
    <div className="switch-wrapper">
      <SwitchPrimitives.Root id={props.id || switchId} className={cn('switch-root', className)} {...props} ref={ref}>
        <SwitchPrimitives.Thumb className="switch-thumb" />
      </SwitchPrimitives.Root>
      {(label || description) && (
        <div className="switch-label-wrapper">
          {/* TODO: Design system: update to Label component once available */}
          <label htmlFor={props.id || switchId} className="switch-label">
            {(props.required ? `${label} *` : label) || ''}
          </label>
          {/* TODO: Design system: update to Text component once available */}
          <p className="switch-description">{description || ''}</p>
        </div>
      )}
    </div>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
