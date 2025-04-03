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
        className="peer flex size-4 shrink-0 items-center justify-center rounded-sm border border-icons-1 hover:border-icons-3 disabled:cursor-not-allowed disabled:border-icons-4 data-[state=checked]:border-icons-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current mt-[1px]')}>
          <Icon name="checkbox" width={10} height={7} className="text-icons-5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </div>
  )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
