import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { CanaryOutletFactory, CanaryOutletName } from '@utils/CanaryOutletFactory'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-14 font-medium transition-colors disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'bg-cn-background-primary text-cn-foreground-primary hover:bg-button-background-accent-2 disabled:bg-button-background-accent-3 disabled:text-button-foreground-accent-2',
        destructive:
          'bg-button-background-danger-1 text-button-foreground-danger-1 hover:bg-button-background-danger-2',
        outline:
          'border border-cn-borders-2 bg-transparent text-cn-foreground-2 hover:border-cn-borders-6 hover:text-cn-foreground-1',
        secondary: 'bg-cn-background-3 text-cn-foreground-2 hover:bg-cn-background-3/80',
        tertiary: 'bg-cn-background-2 text-cn-foreground-2 hover:bg-cn-background-2/80',
        ghost: 'hover:bg-cn-background-12 hover:text-cn-foreground-1',
        link: 'text-cn-foreground-1 underline-offset-4 hover:underline',
        link_accent: 'text-cn-foreground-accent underline-offset-4 hover:underline',
        split: 'flex items-center gap-1.5 border p-0',
        'gradient-border': 'bg-cn-background-2 text-cn-foreground-1 hover:bg-cn-background-8',
        custom: ''
      },
      size: {
        default: 'h-8 px-6',
        sm: 'h-7 px-3 text-sm font-normal',
        xs: 'h-auto px-1.5 py-0.5 text-xs font-normal',
        md: 'h-9 px-7',
        lg: 'h-10 px-8',
        icon: 'size-8',
        xs_icon: 'size-6',
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
        error:
          'border-cn-borders-danger/30 bg-button-background-danger-1 text-cn-foreground-danger hover:bg-button-background-danger-2',
        warning:
          'border-cn-borders-danger/30 bg-button-background-danger-1 text-cn-foreground-warning hover:bg-button-background-danger-2',
        success:
          'border-button-border-success-1 bg-button-background-success-1 text-button-foreground-success-1 hover:bg-button-background-success-2',
        muted: 'border-cn-borders-3/20 bg-cn-background-1/10 text-cn-foreground-3',
        primary: 'border-cn-borders-brand/20 bg-cn-background-primary text-cn-foreground-primary',
        disabled:
          'border-button-border-disabled-1 bg-button-background-disabled-1 text-button-foreground-disabled-1 disabled:bg-button-background-disabled-1 disabled:text-button-foreground-disabled-1'
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

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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

export { Button, buttonVariants, type ButtonProps }
