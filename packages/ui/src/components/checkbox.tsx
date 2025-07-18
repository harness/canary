import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { FormCaption, IconV2, Label } from '@/components'
import { cn } from '@/utils/cn'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva } from 'class-variance-authority'

const checkboxVariants = cva('cn-checkbox-root', {
  variants: {
    error: {
      true: 'cn-checkbox-error'
    }
  },
  defaultVariants: {
    error: false
  }
})

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  caption?: string
  error?: boolean
  showOptionalLabel?: boolean
}

/**
 * Checkbox component that provides a customizable, accessible checkbox input.
 * Built on top of Radix UI Checkbox primitive with additional styling.
 */
const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, Omit<CheckboxProps, 'required'>>(
  ({ className, label, caption, error, showOptionalLabel, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).slice(2, 11)}`

    // Extract the onCheckedChange handler from props
    const { onCheckedChange } = props

    // Create a handler for label/wrapper clicks
    const handleWrapperClick = (e: React.MouseEvent) => {
      e.stopPropagation()

      // Don't do anything if disabled
      if (props.disabled) return

      // Get current checked state
      const currentChecked = props.checked !== undefined ? props.checked : false

      // Toggle the state
      const newChecked = currentChecked === true ? false : true

      // Call the onCheckedChange handler if provided
      if (onCheckedChange) {
        onCheckedChange(newChecked)
      }
    }

    return (
      <div
        className={cn('cn-checkbox-wrapper', className, props.disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
        onClick={handleWrapperClick}
      >
        <CheckboxPrimitive.Root
          id={checkboxId}
          ref={ref}
          className={checkboxVariants({ error })}
          // Pass all props except onClick which we don't want to override
          {...props}
          // Stop propagation to prevent double-triggering with the wrapper click
          // onClick={e => e.stopPropagation()}
          onCheckedChange={onCheckedChange}
        >
          <CheckboxPrimitive.Indicator className="cn-checkbox-indicator">
            {props.checked === 'indeterminate' ? (
              <IconV2 name="minus" className="cn-checkbox-icon" skipSize />
            ) : (
              <IconV2 name="check" className="cn-checkbox-icon" skipSize />
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
            <FormCaption disabled={props.disabled}>{caption}</FormCaption>
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
