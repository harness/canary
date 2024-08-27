import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { CanaryOutletFactory, CanaryOutletName } from '@/lib/CanaryOutletFactory'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        tertiary: 'bg-tertiary text-secondary-foreground shadow-sm hover:bg-tertiary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        xs: 'h-auto py-0.5 rounded-md px-1.5 text-xs font-normal',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        sm_icon: 'h-7 w-7'
      },
      borderRadius: {
        default: '',
        full: 'rounded-full'
      },
      padding: {
        default: '',
        sm: 'px-2.5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      padding: 'default',
      borderRadius: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  spinner?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      padding,
      borderRadius,
      asChild = false,
      loading,
      disabled,
      spinner,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const _children = loading ? (
      <>
        {(loading && spinner) ||
          CanaryOutletFactory.getOutlet(CanaryOutletName.BUTTON_SPINNER, {
            className,
            variant,
            size,
            padding,
            borderRadius,
            asChild,
            loading,
            disabled,
            children,
            ...props
          })}
        {children}
      </>
    ) : (
      children
    )
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, padding, borderRadius, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
        children={_children}></Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
