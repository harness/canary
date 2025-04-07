import * as React from 'react'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const toggleVariants = cva(
  `inline-flex items-center justify-center text-xs font-medium text-cn-foreground-2 
  transition-colors 
  hover:text-cn-foreground-2 disabled:pointer-events-none 
  disabled:opacity-50 data-[state=on]:text-cn-foreground-1`,
  {
    variants: {
      variant: {
        default: 'rounded bg-transparent',
        outline: 'rounded border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        compact: ''
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-3',
        xs: 'h-6 px-[1.125rem]',
        icon: 'size-8'
      },
      theme: {
        light: 'data-[state=on]:bg-cn-background-1',
        dark: 'data-[state=on]:bg-background-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      theme: 'dark'
    }
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn(toggleVariants({ variant, size, className }))} {...props} />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
