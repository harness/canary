import { ButtonHTMLAttributes, forwardRef, Fragment, useCallback, useState } from 'react'

import { Tooltip, TooltipProps } from '@components/tooltip'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { filterChildrenByDisplayNames, isPromise } from '@utils/utils'
import { cva, type VariantProps } from 'class-variance-authority'

import { IconV2, IconV2DisplayName } from './icon-v2'

const buttonVariants = cva('cn-button', {
  variants: {
    variant: {
      primary: 'cn-button-primary',
      secondary: 'cn-button-secondary',
      outline: 'cn-button-outline',
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
      default: 'cn-button-default',
      success: 'cn-button-success',
      danger: 'cn-button-danger'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    theme: 'default'
  }
})

type ButtonTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side'>

type CommonButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    rounded?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>
  }

type ButtonPropsIconOnlyRequired = {
  iconOnly: true
  ignoreIconOnlyTooltip?: false
  tooltipProps: ButtonTooltipProps
}

type ButtonPropsIconOnlyIgnored = {
  iconOnly: true
  ignoreIconOnlyTooltip: true
  tooltipProps?: never
}

type ButtonPropsRegular = {
  iconOnly?: false
  tooltipProps?: ButtonTooltipProps
  ignoreIconOnlyTooltip?: boolean
}

// base type that accepts boolean | undefined for iconOnly
type ButtonPropsBase = {
  iconOnly?: boolean | undefined
  tooltipProps?: ButtonTooltipProps
  ignoreIconOnlyTooltip?: boolean
}

type ButtonProps = CommonButtonProps &
  (ButtonPropsIconOnlyRequired | ButtonPropsIconOnlyIgnored | ButtonPropsRegular | ButtonPropsBase)

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
      ignoreIconOnlyTooltip,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isPromiseLoading, setIsPromiseLoading] = useState(false)

    const Comp = asChild ? Slot : 'button'
    const microSize = size === '2xs' || size === '3xs'
    const iconOnly = iconOnlyProp || microSize

    // Handle onClick that might return a promise
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
          const result = onClick(event)

          // Check if onClick returned a promise (result could be void)
          if (isPromise(result)) {
            setIsPromiseLoading(true)
            ;(result as Promise<unknown>).finally(() => {
              setIsPromiseLoading(false)
            })
          }
        }
      },
      [onClick]
    )

    const filteredChildren = iconOnly ? filterChildrenByDisplayNames(_children, [IconV2DisplayName])[0] : _children

    // Show loading if either loading prop is true or promise is loading
    const isLoading = loading || isPromiseLoading

    const children = isLoading ? (
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
        disabled={disabled || isLoading}
        type={type}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Comp>
    )

    if (tooltipProps && !ignoreIconOnlyTooltip) {
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
