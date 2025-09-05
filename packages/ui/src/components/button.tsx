import { ButtonHTMLAttributes, forwardRef, Fragment } from 'react'

import { Tooltip, TooltipProps } from '@components/tooltip'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { filterChildrenByDisplayNames } from '@utils/utils'
import { cva, type VariantProps } from 'class-variance-authority'

import { IconV2, IconV2DisplayName } from './icon-v2'

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
      md: '',
      sm: 'cn-button-sm',
      xs: 'cn-button-xs',
      '2xs': 'cn-button-2xs',
      '3xs': 'cn-button-3xs'
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
      class: 'cn-button-solid cn-button-success'
    },
    {
      variant: 'primary',
      theme: 'danger',
      class: 'cn-button-solid cn-button-danger'
    },

    // Secondary
    {
      variant: 'secondary',
      theme: 'default',
      class: 'cn-button-muted cn-button-soft'
    },
    // Secondary
    {
      variant: 'secondary',
      theme: 'success',
      class: 'cn-button-success cn-button-soft'
    },
    // Secondary
    {
      variant: 'secondary',
      theme: 'danger',
      class: 'cn-button-danger cn-button-soft'
    },

    // Default Outline
    {
      variant: 'outline',
      theme: 'default',
      class: 'cn-button-muted'
    }
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    theme: 'default'
  }
})

type ButtonTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side'>

type CommonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    rounded?: boolean
  }

type ButtonPropsIconOnlyRequired = {
  iconOnly: true
  ignoreIconOnlyTooltip?: false
  tooltipProps: ButtonTooltipProps
}

type ButtonPropsIconOnlyIgnored = {
  iconOnly: true
  ignoreIconOnlyTooltip: true
  tooltipProps?: ButtonTooltipProps
}

type ButtonPropsRegular = {
  iconOnly?: false
  tooltipProps?: ButtonTooltipProps
  ignoreIconOnlyTooltip?: boolean
}

type ButtonProps = CommonButtonProps & (ButtonPropsIconOnlyRequired | ButtonPropsIconOnlyIgnored | ButtonPropsRegular)

type ButtonThemes = VariantProps<typeof buttonVariants>['theme']
type ButtonVariants = VariantProps<typeof buttonVariants>['variant']
type ButtonSizes = VariantProps<typeof buttonVariants>['size']

// add icon only aria attr if iconOnly is true

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      theme = 'default',
      rounded,
      iconOnly: iconOnlyProp = false,
      asChild = false,
      loading,
      disabled,
      children: _children,
      type = 'button',
      tooltipProps,
      ignoreIconOnlyTooltip: _,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const microSize = size === '2xs' || size === '3xs'
    const iconOnly = iconOnlyProp || microSize

    const filteredChildren = iconOnly ? filterChildrenByDisplayNames(_children, [IconV2DisplayName])[0] : _children

    const children = loading ? (
      <>
        <IconV2 className="animate-spin" name="loader" />
        {/* When button state is 'loading' and iconOnly is true, we show only 1 icon */}
        {!iconOnly && filteredChildren}
      </>
    ) : (
      filteredChildren
    )

    const ButtonComp = (
      <Comp
        className={cn(buttonVariants({ variant, size, theme, rounded, iconOnly, className }))}
        ref={ref}
        disabled={disabled || loading}
        type={type}
        {...props}
      >
        {children}
      </Comp>
    )

    if (tooltipProps) {
      return (
        <Tooltip hideArrow {...tooltipProps}>
          {ButtonComp}
        </Tooltip>
      )
    }

    return ButtonComp
  }
)
Button.displayName = 'Button'

/**
 * Converts iconOnly into a literal and returns props ready to be spread into <Button />
 * @param p
 */
type BtnIconOnly = Extract<ButtonProps, { iconOnly: true }>
type BtnRegular = Extract<ButtonProps, { iconOnly?: false }>
type ButtonLike = Omit<Partial<ButtonProps>, 'iconOnly' | 'ignoreIconOnlyTooltip'> & {
  iconOnly?: boolean
  ignoreIconOnlyTooltip?: boolean
}

const toButtonProps = (p: ButtonLike) => {
  if (p?.iconOnly) {
    return {
      ...p,
      iconOnly: true,
      ignoreIconOnlyTooltip: (p as any)?.ignoreIconOnlyTooltip ?? false
    } as BtnIconOnly
  }

  const { ignoreIconOnlyTooltip: _drop, ...rest } = p as any
  return {
    ...rest,
    iconOnly: false
  } as BtnRegular
}

export { Button, buttonVariants, toButtonProps }
export type {
  ButtonProps,
  ButtonThemes,
  ButtonVariants,
  ButtonSizes,
  ButtonTooltipProps,
  ButtonPropsIconOnlyRequired,
  ButtonPropsRegular
}
