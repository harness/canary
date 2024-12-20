import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { CanaryOutletFactory, CanaryOutletName } from '@utils/CanaryOutletFactory'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium transition-colors disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'bg-background-5 text-foreground-6 hover:bg-background-10 disabled:bg-background-6 disabled:text-foreground-9',
        destructive: 'bg-background-button-danger-1 text-foreground-button-danger hover:bg-background-button-danger-3',
        outline:
          'border border-borders-2 bg-transparent text-foreground-2 hover:border-borders-6 hover:text-foreground-8',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        tertiary: 'bg-tertiary text-secondary-foreground shadow-sm hover:bg-tertiary/80',
        ghost: 'hover:bg-background-12 hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        link_accent: 'text-foreground-accent underline-offset-4 hover:underline',
        split: 'flex items-center gap-1.5 border p-0',
        'gradient-border': 'bg-background-2 text-foreground-1 hover:bg-background-8',
        custom: ''
      },
      size: {
        default: 'h-8 px-6',
        sm: 'h-7 px-3 text-sm font-normal',
        xs: 'h-auto px-1.5 py-0.5 text-xs font-normal',
        md: 'h-9 px-7',
        lg: 'h-10 px-8',
        icon: 'size-8',
        sm_icon: 'size-7',
        xs_split: 'h-auto p-0 text-xs font-medium',
        md_split: 'h-8 text-14 font-medium',
        lg_split: 'h-10 p-0 font-medium'
      },
      borderRadius: {
        default: '',
        full: 'rounded-full focus-visible:rounded-full',
        none: 'rounded-none'
      },
      theme: {
        default: '',
        error: 'border-borders-danger/30 bg-background-danger text-error',
        warning: 'border-borders-danger/30 bg-background-danger text-warning',
        success: 'border-borders-success/30 bg-background-success text-success',
        muted: 'border-tertiary-background/20 bg-tertiary-background/10 text-tertiary-background',
        primary: 'border-primary-foreground/20 bg-background-5 text-foreground-6'
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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  spinner?: ReactNode
  dropdown?: ReactNode
  gradientType?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
