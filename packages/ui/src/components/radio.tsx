import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactElement } from 'react'

import { ControlGroup, FormCaption, Label } from '@/components'
import { cn } from '@/utils/cn'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva } from 'class-variance-authority'

const radioRootVariants = cva('cn-radio-root', {
  variants: {
    error: {
      true: 'cn-radio-error'
    }
  },
  defaultVariants: {
    error: false
  }
})

interface RadioItemProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string | ReactElement
  caption?: string | ReactElement
  error?: boolean
  showOptionalLabel?: boolean
}

export interface RadioProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  label?: string
  error?: boolean
}

/**
 * A styled radio button input component
 * @component
 * @example
 * <Radio.Item value="option1" name="group" label="Option 1" caption="This is option 1" />
 */
const RadioItem = forwardRef<ElementRef<typeof RadioGroupPrimitive.Item>, Omit<RadioItemProps, 'required'>>(
  ({ className, label, caption, error, showOptionalLabel, ...props }, ref) => {
    const radioId = props.id || `radio-${Math.random().toString(36).slice(2, 11)}`

    return (
      <div className={cn('cn-radio-item-wrapper', className)}>
        <RadioGroupPrimitive.Item ref={ref} id={radioId} className="cn-radio-item" {...props}>
          <RadioGroupPrimitive.Indicator className="cn-radio-item-indicator" />
        </RadioGroupPrimitive.Item>

        {(label || caption) && (
          <div className="cn-radio-item-label-wrapper">
            <Label
              htmlFor={radioId}
              optional={showOptionalLabel}
              className={`cn-radio-item-label ${props.disabled ? 'disabled' : ''}`}
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
RadioItem.displayName = RadioGroupPrimitive.Item.displayName

/**
 * A container component for radio group items
 * @component
 * @example
 * <Radio.Root onValueChange={(value) => console.log(value)}>
 *   <Radio.Item value="option1" name="group" label="Option 1" />
 * </Radio.Root>
 */
const RadioRoot = forwardRef<ElementRef<typeof RadioGroupPrimitive.Root>, RadioProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <ControlGroup className={cn('cn-radio-control')}>
        <Label>{label}</Label>
        <RadioGroupPrimitive.Root className={cn(radioRootVariants({ error }), className)} {...props} ref={ref} />
      </ControlGroup>
    )
  }
)
RadioRoot.displayName = RadioGroupPrimitive.Root.displayName

export const Radio = {
  Root: RadioRoot,
  Item: RadioItem
}
