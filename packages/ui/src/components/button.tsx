import { ButtonHTMLAttributes, forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from './icon'

const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: '',
      secondary: '',
      outline: '',
      ai: 'button-ai',
      // solid: 'button-solid',
      // surface: 'button-surface',
      // soft: 'button-soft',
      ghost: 'button-ghost',
      link: 'button-link'
    },
    size: {
      default: '',
      lg: 'button-lg',
      sm: 'button-sm'
    },
    rounded: {
      true: 'button-rounded'
    },

    iconOnly: {
      true: 'button-icon-only'
    },

    theme: {
      default: '',
      success: 'button-success',
      danger: 'button-danger'
      // primary: 'button-primary',
      // muted: 'button-muted',
      // ai: 'button-ai'
    }
  },
  compoundVariants: [
    // Primary
    {
      variant: 'primary',
      theme: 'default',
      class: 'button-solid button-primary'
    },
    {
      variant: 'primary',
      theme: 'success',
      class: 'button-soft button-success'
    },
    {
      variant: 'primary',
      theme: 'danger',
      class: 'button-soft button-danger'
    },

    // Secondary
    {
      variant: 'secondary',
      theme: 'default',
      class: 'button-muted button-soft'
    },

    // Outline
    {
      variant: 'outline',
      theme: 'default',
      class: 'button-muted button-surface'
    },
    {
      variant: 'outline',
      theme: 'success',
      class: 'button-success button-surface'
    },
    {
      variant: 'outline',
      theme: 'danger',
      class: 'button-danger button-surface'
    },

    // Ghost
    {
      variant: 'ghost',
      theme: 'default',
      class: 'button-ghost button-muted'
    },
    {
      variant: 'ghost',
      theme: 'success',
      class: 'button-ghost button-success'
    },
    {
      variant: 'ghost',
      theme: 'danger',
      class: 'button-ghost button-danger'
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
