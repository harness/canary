import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Icon } from '@/components'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@utils/cn'

interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

/**
 * Checkbox component that provides a customizable, accessible checkbox input.
 * Built on top of Radix UI Checkbox primitive with additional styling.
 * @example
 * <Checkbox id="checkbox" checked={checkboxValue} onCheckedChange={checkboxChange} />
 */
const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('flex gap-x-2.5', className)}>
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer flex size-4 shrink-0 items-center justify-center rounded-sm border border-icons-1 disabled:cursor-not-allowed disabled:border-icons-4 data-[state=checked]:bg-cn-background-accent data-[state=checked]:text-cn-foreground-primary',
          {
            'bg-cn-background-accent text-cn-foreground-primary': props.checked === 'indeterminate'
          }
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current mt-[1px]')}>
          {props.checked === 'indeterminate' ? <Icon name="minus" size={10} /> : <Icon name="checkbox" size={10} />}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </div>
  )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
