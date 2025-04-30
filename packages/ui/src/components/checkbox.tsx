import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Icon, Label } from '@/components'
import { cn } from '@/utils/cn'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  caption?: string
  optional?: boolean
}

/**
 * Checkbox component that provides a customizable, accessible checkbox input.
 * Built on top of Radix UI Checkbox primitive with additional styling.
 */
const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, caption, optional, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).slice(2, 11)}`

    return (
      <div className={cn('checkbox-wrapper', className)}>
        <CheckboxPrimitive.Root id={checkboxId} ref={ref} className={cn('checkbox-root')} {...props}>
          <CheckboxPrimitive.Indicator className="checkbox-indicator">
            {props.checked === 'indeterminate' ? (
              <Icon name="minus" className="checkbox-icon" skipSize />
            ) : (
              <Icon name="check" className="checkbox-icon" skipSize />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || caption) && (
          <div className="checkbox-label-wrapper">
            <Label
              htmlFor={checkboxId}
              optional={optional}
              className={`checkbox-label ${props.disabled ? 'disabled' : ''}`}
            >
              {label}
            </Label>
            <p className={`checkbox-caption ${props.disabled ? 'disabled' : ''}`}>{caption || ''}</p>
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
