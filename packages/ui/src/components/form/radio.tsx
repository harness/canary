import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@utils/cn'

/**
 * A container component for radio group items
 * @component
 * @example
 * <RadioGroup onValueChange={(value) => console.log(value)}>
 *   <RadioGroupItem control={<RadioButton />} id="option1" label="Option 1" />
 * </RadioGroup>
 */
const RadioGroup = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Root>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-5', className)} {...props} ref={ref} />
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

/**
 * A styled radio button input component
 * @component
 * @example
 * <RadioButton value="option1" name="group" />
 */
const RadioButton = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'relative border-primary hover:border-icons-3 text-icons-5 aspect-square h-4 w-4 rounded-full border shadow focus-visible:rounded-full disabled:cursor-not-allowed disabled:border-icons-4 flex items-center justify-center',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-2 rounded-full bg-primary" />
    </RadioGroupPrimitive.Item>
  )
})
RadioButton.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioButton }
