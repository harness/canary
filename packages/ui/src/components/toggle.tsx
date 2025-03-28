import * as React from 'react'

import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const toggleVariants = cva(
  `text-foreground-4 hover:text-foreground-2 data-[state=on]:text-foreground-1 inline-flex items-center justify-center 
  text-xs 
  font-medium transition-colors 
  disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: 'rounded bg-transparent',
        outline: 'border-input hover:bg-accent hover:text-accent-foreground rounded border bg-transparent shadow-sm',
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
        light: 'data-[state=on]:bg-background-1',
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
