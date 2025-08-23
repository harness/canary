import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { FormCaption, IconV2, Label, TextProps } from '@/components'
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
  truncateLabel?: boolean
  captionVariant?: TextProps['variant']
}

/**
 * Checkbox component that provides a customizable, accessible checkbox input.
 * Built on top of Radix UI Checkbox primitive with additional styling.
 */
const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, Omit<CheckboxProps, 'required'>>(
  ({ className, label, caption, error, showOptionalLabel, truncateLabel = true, captionVariant, ...props }, ref) => {
    const checkboxId = props.id || `checkbox-${Math.random().toString(36).slice(2, 11)}`

    return (
      <div className={cn('cn-checkbox-wrapper', className)}>
        <CheckboxPrimitive.Root id={checkboxId} ref={ref} className={checkboxVariants({ error })} {...props}>
          <CheckboxPrimitive.Indicator className="cn-checkbox-indicator">
            {props.checked === 'indeterminate' ? (
              <IconV2 name="minus" className="cn-icon" size="2xs" />
            ) : (
              <IconV2 name="check" className="cn-icon" size="2xs" />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {(label || caption) && (
          <div className="cn-checkbox-label-wrapper">
            <Label
              htmlFor={checkboxId}
              optional={showOptionalLabel}
              className={cn(
                'cn-checkbox-label',
                { disabled: props.disabled },
                { 'cn-checkbox-label-no-truncate': !truncateLabel }
              )}
            >
              {label}
            </Label>
            <FormCaption disabled={props.disabled} variant={captionVariant}>
              {caption}
            </FormCaption>
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
