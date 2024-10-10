import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { CanaryOutletFactory, CanaryOutletName } from '@/lib/CanaryOutletFactory'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        tertiary: 'bg-tertiary text-secondary-foreground shadow-sm hover:bg-tertiary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        split: 'border flex items-center gap-1.5 p-0',
        'gradient-border': 'bg-background hover:bg-accent text-primary hover:text-accent-foreground'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 py-0 text-sm font-normal',
        xs: 'h-auto py-0.5 px-1.5 text-xs font-normal',
        lg: 'h-10 px-8',
        icon: 'h-9 w-9',
        sm_icon: 'h-7 w-7',
        xs_split: 'h-auto p-0 text-xs font-medium'
      },
      borderRadius: {
        default: '',
        full: 'rounded-full'
      },
      theme: {
        default: '',
        error: 'text-error border-[hsla(var(--error),0.3)] bg-[hsla(var(--error),0.1)]',
        warning: 'text-warning border-[hsla(var(--warning),0.3)] bg-[hsla(var(--warning),0.1)]',
        success: 'text-success border-[hsla(var(--success),0.3)] bg-[hsla(var(--success),0.1)]',
        muted: 'text-tertiary-background border-tertiary-background/20 bg-tertiary-background/10'
      },
      padding: {
        default: '',
        sm: 'px-2.5'
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
            {...props}>
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
        {...props}>
        {variant === 'split' && dropdown ? (
          <>
            <div className="flex pl-2.5 pr-1 py-0.5 items-center">{_children}</div>
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
