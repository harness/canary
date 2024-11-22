import * as React from 'react'

import { CanaryOutletFactory, CanaryOutletName } from '@/lib/CanaryOutletFactory'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline: 'border-borders-2 text-foreground-2 hover:border-borders-6 hover:text-foreground-8 border',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
        tertiary: 'bg-tertiary text-secondary-foreground hover:bg-tertiary/80 shadow-sm',
        ghost: 'text-foreground-8 hover:bg-background-4 hover:text-foreground-1',
        link: 'text-primary underline-offset-4 hover:underline',
        link_accent: 'text-foreground-accent underline-offset-4 hover:underline',
        split: 'flex items-center gap-1.5 border p-0',
        'gradient-border': 'bg-background-2 text-foreground-1 hover:bg-background-8',
        custom: ''
      },
      size: {
        default: 'h-8 px-6 py-2',
        sm: 'h-7 px-3 py-0 text-sm font-normal',
        xs: 'h-auto px-1.5 py-0.5 text-xs font-normal',
        lg: 'h-10 px-8',
        icon: 'size-8',
        sm_icon: 'size-7',
        xs_split: 'h-auto p-0 text-xs font-medium',
        custom: ''
      },
      borderRadius: {
        default: '',
        full: 'rounded-full'
      },
      theme: {
        default: '',
        error: 'border-borders-danger/30 bg-background-danger text-error',
        warning: 'border-borders-warning/30 bg-background-warning text-warning',
        success: 'border-borders-success/30 bg-background-success text-success',
        muted: 'border-tertiary-background/20 bg-tertiary-background/10 text-tertiary-background',
        primary: 'border-primary-foreground/20 bg-primary text-primary-foreground'
      },
      padding: {
        default: '',
        sm: 'px-3'
      },
      gradient: {
        default: 'ai-button'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      theme: 'default',
      padding: 'default',
      borderRadius: 'default',
      gradient: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  spinner?: React.ReactNode
  dropdown?: React.ReactNode
  gradientType?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      padding,
      theme,
      borderRadius,
      gradientType,
      asChild = false,
      loading,
      disabled,
      spinner,
      dropdown,
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
            theme,
            padding,
            borderRadius,
            gradientType,
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

    const gradientClassMap: Record<string, string> = {
      'ai-button': 'bg-ai-button'
    }

    const gradientClass = gradientType ? gradientClassMap[gradientType] : ''

    if (variant === 'gradient-border' && gradientType) {
      return (
        <div className={cn(buttonVariants({ size, borderRadius }), 'p-[1px]', gradientClass)}>
          <Comp
            className={cn(buttonVariants({ variant, padding, borderRadius, className }), 'h-full')}
            ref={ref}
            disabled={disabled || loading}
            {...props}
          >
            {_children}
          </Comp>
        </div>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, theme, padding, borderRadius, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {variant === 'split' && dropdown ? (
          <>
            <div className="flex items-center py-0.5 pl-2.5 pr-1">{_children}</div>
            {dropdown}
          </>
        ) : (
          _children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
