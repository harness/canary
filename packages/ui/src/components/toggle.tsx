import { ElementRef, forwardRef, MouseEvent, PropsWithoutRef, useCallback, useState } from 'react'

import { Button, ButtonProps, ButtonTooltipProps, IconPropsV2, IconV2, IconV2NamesType } from '@/components'
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

type TogglePropsBase = Pick<ButtonProps, 'disabled' | 'className'> & {
  /** Applies the supported rounded shape to icon-only Toggles. Rounded text Toggles are deprecated. */
  rounded?: boolean
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

type ToggleIconOnlyShared = {
  iconOnly: true
  prefixIcon: IconV2NamesType
  prefixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
  suffixIcon?: never
  suffixIconProps?: never
}

type TogglePropsIconOnly =
  | (ToggleIconOnlyShared & {
      text: string
      'aria-label'?: string
      'aria-labelledby'?: string
      tooltipProps?: ButtonTooltipProps
      ignoreIconOnlyTooltip?: boolean
    })
  | (ToggleIconOnlyShared & {
      text?: string
      'aria-label': string
      'aria-labelledby'?: string
      tooltipProps: ButtonTooltipProps
      ignoreIconOnlyTooltip?: boolean
    })
  | (ToggleIconOnlyShared & {
      text?: string
      'aria-label': string
      'aria-labelledby'?: string
      ignoreIconOnlyTooltip: true
      tooltipProps?: never
    })
  | (ToggleIconOnlyShared & {
      text?: string
      'aria-label'?: string
      'aria-labelledby': string
      tooltipProps: ButtonTooltipProps
      ignoreIconOnlyTooltip?: boolean
    })
  | (ToggleIconOnlyShared & {
      text?: string
      'aria-label'?: string
      'aria-labelledby': string
      ignoreIconOnlyTooltip: true
      tooltipProps?: never
    })

type TogglePropsNotIconOnly = {
  iconOnly?: false
  prefixIcon?: IconV2NamesType
  prefixIconProps?: PropsWithoutRef<Omit<IconPropsV2, 'name'>>
  tooltipProps?: ButtonTooltipProps
  ignoreIconOnlyTooltip?: never
  'aria-label'?: string
  'aria-labelledby'?: string
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
      selected: selectedProp,
      ignoreIconOnlyTooltip,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy
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

    const accessibleLabel = ariaLabel ?? text
    const resolvedTooltipProps = tooltipProps ?? (text !== undefined ? { content: text } : undefined)

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

    const button = iconOnly ? (
      ignoreIconOnlyTooltip ? (
        <Button
          {...({
            className: cn(className, toggleVariants({ size, variant, iconOnly })),
            variant: selected ? selectedVariant : variant,
            disabled,
            size,
            rounded,
            'aria-label': accessibleLabel,
            'aria-labelledby': ariaLabelledBy,
            iconOnly: true,
            ignoreIconOnlyTooltip: true
          } as ButtonProps)}
        >
          {renderContent()}
        </Button>
      ) : (
        <Button
          {...({
            className: cn(className, toggleVariants({ size, variant, iconOnly })),
            variant: selected ? selectedVariant : variant,
            disabled,
            size,
            rounded,
            'aria-label': accessibleLabel,
            'aria-labelledby': ariaLabelledBy,
            iconOnly: true,
            tooltipProps: resolvedTooltipProps
          } as ButtonProps)}
        >
          {renderContent()}
        </Button>
      )
    ) : (
      <Button
        className={cn(className, toggleVariants({ size, variant, iconOnly }))}
        variant={selected ? selectedVariant : variant}
        disabled={disabled}
        size={size}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tooltipProps={tooltipProps}
      >
        {renderContent()}
      </Button>
    )

    return (
      <TogglePrimitive.Root ref={ref} asChild pressed={selected} onClick={handleClick} disabled={disabled}>
        {button}
      </TogglePrimitive.Root>
    )
  }
)
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }

export type { TogglePropsIconOnly, TogglePropsNotIconOnly }
