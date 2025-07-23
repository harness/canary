import { ElementRef, FC, forwardRef, PropsWithoutRef, ReactNode, useCallback, useState } from 'react'

import { Button, ButtonProps, IconPropsV2, IconV2, IconV2NamesType, Tooltip, TooltipProps } from '@/components'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cn } from '@utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'

export const toggleVariants = cva('cn-toggle', {
  variants: {
    size: {
      md: 'cn-toggle-md',
      sm: 'cn-toggle-sm',
      xs: 'cn-toggle-xs'
    },
    variant: {
      outline: '',
      ghost: '',
      transparent: 'cn-toggle-transparent'
    },
    iconOnly: {
      true: '',
      false: 'cn-toggle-text'
    }
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
    iconOnly: false
  }
})

type ToggleVariant = VariantProps<typeof toggleVariants>['variant']
type TypeSelectedVariant = 'primary' | 'secondary'
type ToggleTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>

type TogglePropsBase = Pick<ButtonProps, 'rounded' | 'iconOnly' | 'disabled'> & {
  variant?: ToggleVariant
  selectedVariant?: TypeSelectedVariant
  onChange?: (selected: boolean) => void
  text?: string
  size?: VariantProps<typeof toggleVariants>['size']
  suffixIcon?: IconV2NamesType
  suffixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
  selected?: boolean
  defaultValue?: boolean
  tooltipProps?: ToggleTooltipProps
  className?: string
}

type TogglePropsIconOnly = TogglePropsBase & {
  iconOnly: true
  prefixIcon: IconV2NamesType
  prefixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
  suffixIcon?: never
  suffixIconProps?: never
}

type TogglePropsNotIconOnly = TogglePropsBase & {
  iconOnly?: false
  prefixIcon?: IconV2NamesType
  prefixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
}

export type ToggleProps = TogglePropsIconOnly | TogglePropsNotIconOnly

const TooltipWrapper: FC<{ children: ReactNode; tooltipProps?: ToggleTooltipProps }> = ({ children, tooltipProps }) =>
  tooltipProps ? <Tooltip {...tooltipProps}>{children}</Tooltip> : <>{children}</>

const Toggle = forwardRef<ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  (
    {
      className,
      variant = 'outline',
      selectedVariant: selectedVariantProp = 'primary',
      size,
      rounded,
      disabled,
      iconOnly,
      text,
      prefixIcon,
      prefixIconProps,
      suffixIcon,
      suffixIconProps,
      onChange,
      tooltipProps,
      defaultValue,
      selected: selectedProp,
      ...props
    },
    ref
  ) => {
    const isControlled = selectedProp !== undefined
    const [internalSelected, setInternalSelected] = useState(defaultValue)
    const selected = isControlled ? selectedProp : internalSelected
    const selectedVariant = variant === 'transparent' ? 'transparent' : selectedVariantProp

    const handleChange = useCallback(
      (val: boolean) => {
        if (!isControlled) {
          setInternalSelected(val)
        }
        onChange?.(val)
      },
      [isControlled, onChange]
    )

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      handleChange(!selected)
    }

    const accessibilityProps = iconOnly && text ? { 'aria-label': text } : {}

    const renderContent = () => {
      if (iconOnly) {
        return <IconV2 {...prefixIconProps} name={prefixIcon} fallback={prefixIconProps?.fallback ?? 'stop'} />
      }

      return (
        <>
          {prefixIcon && (
            <IconV2 {...prefixIconProps} name={prefixIcon} fallback={prefixIconProps?.fallback ?? 'stop'} />
          )}
          {text}
          {suffixIcon && (
            <IconV2 {...suffixIconProps} name={suffixIcon} fallback={suffixIconProps?.fallback ?? 'stop'} />
          )}
        </>
      )
    }

    return (
      <TooltipWrapper tooltipProps={tooltipProps}>
        <TogglePrimitive.Root ref={ref} {...props} asChild pressed={selected} onClick={handleClick} disabled={disabled}>
          <Button
            className={cn(className, toggleVariants({ size, variant, iconOnly }))}
            variant={selected ? selectedVariant : variant}
            disabled={disabled}
            size={size}
            rounded={rounded}
            iconOnly={iconOnly}
            {...accessibilityProps}
          >
            {renderContent()}
          </Button>
        </TogglePrimitive.Root>
      </TooltipWrapper>
    )
  }
)
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
