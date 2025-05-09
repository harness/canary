import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Icon, Label } from '@/components'
import { cn } from '@/utils/cn'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  caption?: string
  showOptionalLabel?: boolean
}

/**
 * Checkbox component that provides a customizable, accessible checkbox input.
 * Built on top of Radix UI Checkbox primitive with additional styling.
 */
const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, Omit<CheckboxProps, 'required'>>(
  ({ className, label, caption, showOptionalLabel, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).slice(2, 11)}`

    return (
      <div className={cn('cn-checkbox-wrapper', className)}>
        <CheckboxPrimitive.Root id={checkboxId} ref={ref} className={cn('cn-checkbox-root')} {...props}>
          <CheckboxPrimitive.Indicator className="cn-checkbox-indicator">
            {props.checked === 'indeterminate' ? (
              <Icon name="minus" className="cn-checkbox-icon" skipSize />
            ) : (
              <Icon name="check" className="cn-checkbox-icon" skipSize />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || caption) && (
          <div className="cn-checkbox-label-wrapper">
            <Label
              htmlFor={checkboxId}
              optional={showOptionalLabel}
              className={`cn-checkbox-label ${props.disabled ? 'disabled' : ''}`}
            >
              {label}
            </Label>
            <p className={`cn-checkbox-caption ${props.disabled ? 'disabled' : ''}`}>{caption || ''}</p>
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
