import { ComponentPropsWithoutRef, ElementRef, forwardRef, ReactElement } from 'react'

import { Label } from '@/components'
import { cn } from '@/utils/cn'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

interface RadioItemProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string | ReactElement
  caption?: string | ReactElement
  optional?: boolean
}

/**
 * A styled radio button input component
 * @component
 * @example
 * <Radio.Item value="option1" name="group" label="Option 1" caption="This is option 1" />
 */
const RadioItem = forwardRef<ElementRef<typeof RadioGroupPrimitive.Item>, RadioItemProps>(
  ({ className, label, caption, optional, ...props }, ref) => {
    const radioId = props.id || `radio-${Math.random().toString(36).slice(2, 11)}`

    return (
      <div className={cn('cn-radio-wrapper', className)}>
        <RadioGroupPrimitive.Item ref={ref} id={radioId} className={cn('cn-radio-root')} {...props}>
          <RadioGroupPrimitive.Indicator className="cn-radio-indicator" />
        </RadioGroupPrimitive.Item>

        {(label || caption) && (
          <div className="cn-radio-label-wrapper">
            <Label
              htmlFor={radioId}
              optional={optional}
              className={`cn-radio-label ${props.disabled ? 'disabled' : ''}`}
            >
              {label}
            </Label>
            <div className={`cn-radio-caption ${props.disabled ? 'disabled' : ''}`}>{caption || ''}</div>
            {/* Need to add Link component here once merged */}
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
const RadioRoot = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-5', className)} {...props} ref={ref} />
})
RadioRoot.displayName = RadioGroupPrimitive.Root.displayName

export const Radio = {
  Root: RadioRoot,
  Item: RadioItem
}
