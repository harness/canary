import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { cn } from '@/utils/cn'
import * as SwitchPrimitives from '@radix-ui/react-switch'

const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitives.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      `  
      data-[state=checked]:bg-icons-success data-[state=unchecked]:bg-icons-6 
      peer inline-flex h-[18px] w-8 shrink-0 cursor-pointer items-center !rounded-full 
      border-2 border-transparent transition-colors      
      disabled:cursor-not-allowed disabled:opacity-50
      `,
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'bg-icons-10 pointer-events-none block h-3.5 w-3.5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
