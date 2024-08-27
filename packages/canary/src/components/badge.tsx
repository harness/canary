import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground'
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs font-semibold',
        lg: 'px-3 py-1 text-xs font-normal',
        sm: 'px-2 py-0 text-[12px] font-normal',
        xs: 'px-1.5 py-0 text-[11px] font-light'
      },
      hover: {
        enabled: '', // Default hover styles are applied
        disabled: 'hover:bg-transparent hover:shadow-none' // No hover effect
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hover: 'enabled' // Default hover behavior enabled
    }
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  disableHover?: boolean // Add this prop to control hover behavior
}

function Badge({ className, variant, size, disableHover, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, hover: disableHover ? 'disabled' : 'enabled' }), // Apply hover variant based on prop
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
