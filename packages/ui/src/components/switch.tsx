import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils/cn'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { Label } from '.'

interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {}

const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitives.Root>,
  Omit<SwitchProps, 'required'> & {
    label?: string
    caption?: string
    showOptionalLabel?: boolean
  }
>(({ className, label, caption, showOptionalLabel, ...props }, ref) => {
  const switchId = `switch-${Math.random().toString(36).slice(2, 11)}`
  return (
    <div className="cn-switch-wrapper flex items-start w-full">
      <SwitchPrimitives.Root
        id={props.id || switchId}
        className={cn('cn-switch-root flex-shrink-0', className)}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb className="cn-switch-thumb" />
      </SwitchPrimitives.Root>
      {(label || caption) && (
        <div className="cn-switch-label-wrapper flex-1 min-w-0 overflow-hidden ml-2">
          <Label
            htmlFor={props.id || switchId}
            optional={showOptionalLabel}
            className="cn-switch-label block whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {label}
          </Label>
          {/* TODO: Design system: update to Text component once available */}
          <p className="cn-switch-description block whitespace-nowrap overflow-hidden text-ellipsis">{caption || ''}</p>
        </div>
      )}
    </div>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
