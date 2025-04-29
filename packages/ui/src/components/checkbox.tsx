import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Icon } from '@/components'
import { cn } from '@/utils/cn'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
}

/**
 * Checkbox component that provides a customizable, accessible checkbox input.
 * Built on top of Radix UI Checkbox primitive with additional styling.
 */
const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).slice(2, 11)}`

    return (
      <div className={cn('checkbox-wrapper', className)}>
        <CheckboxPrimitive.Root id={checkboxId} ref={ref} className={cn('checkbox-root')} {...props}>
          <CheckboxPrimitive.Indicator className="checkbox-indicator">
            {props.checked === 'indeterminate' ? <Icon name="minus" size={10} /> : <Icon name="check" size={10} />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || description) && (
          <div className="checkbox-label-wrapper">
            <label htmlFor={checkboxId} className={`checkbox-label ${props.disabled ? 'disabled' : ''}`}>
              {(props.required ? `${label} *` : label) || ''}
            </label>
            <p className={`checkbox-description ${props.disabled ? 'disabled' : ''}`}>{description || ''}</p>
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
