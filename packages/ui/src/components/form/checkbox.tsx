import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Icon } from '@/components'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cn } from '@utils/cn'

interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

/**
 * Checkbox component that provides a customizable, accessible checkbox input.
 * Built on top of Radix UI Checkbox primitive with additional styling.
 *
 * @param {CheckboxProps} props - The properties for the Checkbox component.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {React.Ref<HTMLButtonElement>} ref - Forward ref for the checkbox element.
 * @returns {JSX.Element} The rendered Checkbox component.
 */
const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <div className={cn('flex gap-x-2.5', className)}>
      <CheckboxPrimitive.Root
        ref={ref}
        className="border-icons-1 hover:border-icons-3 disabled:border-icons-4 data-[state=checked]:border-icons-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer size-4 shrink-0 rounded-sm border shadow disabled:cursor-not-allowed"
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
          <Icon className="h-1.5 w-2" name="checkbox" width={8} height={6} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </div>
  )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
