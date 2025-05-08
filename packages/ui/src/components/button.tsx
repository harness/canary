import { ButtonHTMLAttributes, forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from './icon'

const buttonVariants = cva('cn-button', {
  variants: {
    variant: {
      primary: '',
      secondary: '',
      outline: 'cn-button-surface',
      ai: 'cn-button-ai',
      ghost: 'cn-button-ghost',
      link: 'cn-button-link',
      transparent: 'cn-button-transparent'
    },
    size: {
      default: '',
      lg: 'cn-button-lg',
      sm: 'cn-button-sm'
    },
    rounded: {
      true: 'cn-button-rounded'
    },

    iconOnly: {
      true: 'cn-button-icon-only'
    },

    theme: {
      default: '',
      success: 'cn-button-success',
      danger: 'cn-button-danger'
    }
  },
  compoundVariants: [
    // Primary
    {
      variant: 'primary',
      theme: 'default',
      class: 'cn-button-solid cn-button-primary'
    },
    {
      variant: 'primary',
      theme: 'success',
      class: 'cn-button-soft cn-button-success'
    },
    {
      variant: 'primary',
      theme: 'danger',
      class: 'cn-button-soft cn-button-danger'
    },

    // Secondary
    {
      variant: 'secondary',
      theme: 'default',
      class: 'cn-button-muted cn-button-soft'
    },

    // Default Outline
    {
      variant: 'outline',
      theme: 'default',
      class: 'cn-button-muted'
    },

    // Default Ghost
    {
      variant: 'ghost',
      theme: 'default',
      class: 'cn-button-muted'
    }
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'default'
  }
})

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  rounded?: boolean
  iconOnly?: boolean
}

export type ButtonThemes = VariantProps<typeof buttonVariants>['theme']
export type ButtonVariants = VariantProps<typeof buttonVariants>['variant']
export type ButtonSizes = VariantProps<typeof buttonVariants>['size']

// add icon only aria attr if iconOnly is true

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      theme = 'default',
      rounded,
      iconOnly,
      asChild = false,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const _children = loading ? (
      <>
        {loading && <Icon className="animate-spin" name="spinner" />}
        {children}
      </>
    ) : (
      children
    )

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant: variant || 'primary',
            size: size || 'default',
            theme: theme || 'default',
            rounded,
            iconOnly,
            className
          })
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {_children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants, type ButtonProps }
