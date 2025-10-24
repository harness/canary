import { ElementRef, forwardRef, MouseEvent, PropsWithoutRef, useCallback, useState } from 'react'

import {
  Button,
  ButtonProps,
  ButtonPropsIconOnlyRequired,
  ButtonPropsRegular,
  IconPropsV2,
  IconV2,
  IconV2NamesType
} from '@/components'
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

type TogglePropsBase = Pick<ButtonProps, 'rounded' | 'disabled' | 'className'> & {
  variant?: ToggleVariant
  selectedVariant?: TypeSelectedVariant
  onChange?: (selected: boolean) => void
  text?: string
  size?: VariantProps<typeof toggleVariants>['size']
  suffixIcon?: IconV2NamesType
  suffixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
  selected?: boolean
  defaultValue?: boolean
}

type TogglePropsIconOnly = ButtonPropsIconOnlyRequired & {
  prefixIcon: IconV2NamesType
  prefixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
  suffixIcon?: never
  suffixIconProps?: never
}

type TogglePropsNotIconOnly = ButtonPropsRegular & {
  prefixIcon?: IconV2NamesType
  prefixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
}

export type ToggleProps = TogglePropsBase & (TogglePropsIconOnly | TogglePropsNotIconOnly)

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
      selected: selectedProp
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

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
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
      <TogglePrimitive.Root ref={ref} asChild pressed={selected} onClick={handleClick} disabled={disabled}>
        <Button
          className={cn(className, toggleVariants({ size, variant, iconOnly }))}
          variant={selected ? selectedVariant : variant}
          disabled={disabled}
          size={size}
          rounded={rounded}
          {...accessibilityProps}
          iconOnly={iconOnly}
          tooltipProps={tooltipProps}
        >
          {renderContent()}
        </Button>
      </TogglePrimitive.Root>
    )
  }
)
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }

export type { TogglePropsIconOnly, TogglePropsNotIconOnly }
