import { ButtonHTMLAttributes, forwardRef } from 'react'

import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

import { Icon } from './icon'

const buttonVariants = cva('button', {
  variants: {
    variant: {
      solid: 'button-solid',
      surface: 'button-surface',
      soft: 'button-soft',
      ghost: 'button-ghost',
      link: 'button-link'
    },
    size: {
      sm: 'button-sm',
      lg: 'button-lg'
    },
    rounded: {
      true: 'button-rounded'
    },

    iconOnly: {
      true: 'button-icon-only'
    },

    theme: {
      success: 'button-success',
      muted: 'button-muted',
      danger: 'button-danger',
      primary: 'button-primary',
      ai: 'button-ai'
    }
  },
  defaultVariants: {
    variant: 'solid',
    theme: 'primary'
  }
})

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  rounded?: boolean
  iconOnly?: boolean
}

export type ButtonThemes = Exclude<NonNullable<VariantProps<typeof buttonVariants>['theme']>, null | undefined>
export type ButtonVariants = Exclude<NonNullable<VariantProps<typeof buttonVariants>['variant']>, null | undefined>
export type ButtonSizes = VariantProps<typeof buttonVariants>['size']

// add icon only aria attr if iconOnly is true

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, theme, rounded, iconOnly, asChild = false, loading, disabled, children, ...props },
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
        className={cn(buttonVariants({ variant, size, theme, rounded, iconOnly, className }))}
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
