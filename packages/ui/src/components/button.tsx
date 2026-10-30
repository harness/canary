import {
  ButtonHTMLAttributes,
  forwardRef,
  Fragment,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from 'react'

import { Tooltip, TooltipProps } from '@components/tooltip'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@utils/cn'
import { filterChildrenByDisplayNames, isPromise } from '@utils/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import isEmpty from 'lodash-es/isEmpty'
import omit from 'lodash-es/omit'

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

    theme: {
      default: 'cn-button-default',
      success: 'cn-button-success',
      danger: 'cn-button-danger',
      warning: 'cn-button-warning'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    theme: 'default'
  }
})

/**
 * Pulls the readable text out of simple tooltip content, so `<span>Delete</span>` can name a
 * button the same way the string "Delete" does. Content with no text in it, such as a custom
 * component that renders its own copy, yields an empty string.
 */
const getNodeText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return getNodeText(node.props.children)
  return ''
}

type ButtonTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align' | 'open'>

type CommonButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    rounded?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<unknown>
  }

type ButtonPropsIconOnlyRequired = {
  iconOnly: true
  tooltipProps: ButtonTooltipProps
}

type ButtonPropsIconOnlyIgnored = {
  iconOnly: true
  ignoreIconOnlyTooltip: true
  tooltipProps?: never
}

type ButtonPropsRegular = {
  iconOnly?: boolean
  tooltipProps?: ButtonTooltipProps
}

type ButtonThemes = VariantProps<typeof buttonVariants>['theme']
type ButtonVariants = VariantProps<typeof buttonVariants>['variant']
type ButtonSizes = VariantProps<typeof buttonVariants>['size']

/**
 * BTN-003. `link`, `transparent` and `ai` are defined by their own appearance — link uses the
 * link color, transparent has no surface of its own to tint, and ai carries the fixed AI
 * treatment — so the theme CVA contributes nothing to them. Passing one used to compile and be
 * silently inert, which reads at the call site as a danger link that is not actually red.
 */
type ButtonThemelessVariants = Extract<NonNullable<ButtonVariants>, 'ai' | 'link' | 'transparent'>
type ButtonThemedVariants = Exclude<NonNullable<ButtonVariants>, ButtonThemelessVariants>

type ButtonProps = CommonButtonProps & (ButtonPropsIconOnlyRequired | ButtonPropsIconOnlyIgnored | ButtonPropsRegular)

/**
 * Opt-in compile-time enforcement of BTN-003: pass no theme and any variant is fine, or pass a
 * theme and the variant must be theme-capable. Not applied to `Button` itself, because a union in
 * `ButtonProps` stops wrappers that spread a wide props object from compiling. `ds-check` enforces
 * the rule for the examples and manifests; use this type where you want the compiler to as well.
 */
type StrictButtonProps = Omit<ButtonProps, 'variant' | 'theme'> &
  ({ variant?: ButtonVariants; theme?: never } | { variant?: ButtonThemedVariants | null; theme?: ButtonThemes })

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
      onClick,
      ...props
    },
    ref
  ) => {
    const [isPromiseLoading, setIsPromiseLoading] = useState(false)

    const Comp = asChild ? Slot : 'button'
    const microSize = size === '2xs' || size === '3xs'
    const iconOnly = iconOnlyProp || microSize

    /**
     * An icon-only button has no text to name it, and a Tooltip is wired as a description
     * rather than a name, so it cannot stand in for one. Copy the tooltip's own text onto
     * aria-label to close that gap: `title` when there is one, otherwise the text found in
     * `content`, which is the required field and so where most icon buttons put their label.
     * An explicit aria-label wins, because props spread after.
     */
    const tooltipContent = props.tooltipProps?.content
    const iconOnlyAriaLabel = iconOnly
      ? props.tooltipProps?.title || getNodeText(tooltipContent).trim() || undefined
      : undefined

    /**
     * The types cannot prove a name exists when tooltip content has no text of its own, and
     * tightening them would break callers, so say so in development instead of shipping a
     * button a screen reader announces as a bare "button". Opting out with
     * ignoreIconOnlyTooltip, or naming the button with aria-label/aria-labelledby, silences it.
     */
    const lacksAccessibleName =
      iconOnly &&
      !iconOnlyAriaLabel &&
      !props['aria-label'] &&
      !props['aria-labelledby'] &&
      !('ignoreIconOnlyTooltip' in props && props.ignoreIconOnlyTooltip)
    useEffect(() => {
      if (process.env.NODE_ENV === 'development' && lacksAccessibleName) {
        console.warn(
          'Button: icon-only button has no accessible name. Pass aria-label, or tooltipProps with a title or text content.'
        )
      }
    }, [lacksAccessibleName])

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
        className={cn(buttonVariants({ variant, size, theme, rounded, className }), {
          'cn-button-icon-only': iconOnly
        })}
        ref={ref}
        disabled={disabled || isLoading}
        type={type}
        onClick={handleClick}
        data-loading={isLoading || undefined}
        aria-label={iconOnlyAriaLabel}
        {...omit(props, ['tooltipProps', 'ignoreIconOnlyTooltip'])}
      >
        {children}
      </Comp>
    )

    if (!isEmpty(props.tooltipProps)) {
      const buttonTooltipProps = props.tooltipProps

      return (
        <Tooltip hideArrow {...buttonTooltipProps}>
          {ButtonComp}
        </Tooltip>
      )
    }

    return ButtonComp
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export type {
  ButtonProps,
  StrictButtonProps,
  ButtonThemes,
  ButtonVariants,
  ButtonSizes,
  ButtonThemedVariants,
  ButtonTooltipProps,
  ButtonPropsIconOnlyRequired,
  ButtonPropsRegular
}
