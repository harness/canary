import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  PropsWithoutRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Button,
  IconPropsV2,
  IconV2,
  IconV2NamesType,
  toButtonProps,
  TogglePropsIconOnly,
  TogglePropsNotIconOnly,
  toggleVariants
} from '@/components'
import { cn } from '@/utils'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { VariantProps } from 'class-variance-authority'

type ToggleGroupVariant = VariantProps<typeof toggleVariants>['variant']
type ToggleGroupSelectedVariant = 'primary' | 'secondary'
type SelectedValuesProp = Map<string, boolean>

interface ToggleGroupContextValue {
  variant: ToggleGroupVariant
  selectedVariant?: ToggleGroupSelectedVariant | 'transparent'
  size: VariantProps<typeof toggleVariants>['size']
  disabled?: boolean
  selectedValues: SelectedValuesProp
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  variant: 'outline',
  size: 'md',
  selectedValues: new Map<string, boolean>()
})

export interface ToggleGroupProps
  extends Omit<
    ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
    'onValueChange' | 'onChange' | 'defaultValue' | 'type' | 'unselectable'
  > {
  type?: ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>['type']
  variant?: ToggleGroupVariant
  selectedVariant?: ToggleGroupSelectedVariant
  size?: VariantProps<typeof toggleVariants>['size']
  disabled?: boolean
  className?: string
  unselectable?: boolean
  onChange?: ((value: string) => void) | ((value: string[]) => void)
}

export type ToggleGroupItemPropsBase = {
  value: string
  disabled?: boolean
  suffixIcon?: IconV2NamesType
  suffixIconProps?: PropsWithoutRef<IconPropsV2>
  text?: string
}

export type ToggleGroupItemProps = ToggleGroupItemPropsBase & (TogglePropsIconOnly | TogglePropsNotIconOnly)

const ToggleGroupRoot = forwardRef<ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  (
    {
      children,
      variant = 'outline',
      selectedVariant: selectedVariantProp,
      size = 'md',
      disabled = false,
      type = 'single',
      value,
      onChange,
      unselectable = false,
      className,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string | string[]>(
      () => value ?? (type === 'multiple' ? [] : '')
    )

    useEffect(() => {
      setInternalValue(value ?? (type === 'multiple' ? [] : ''))
    }, [value, type])

    const handleValueChange = useCallback(
      (newValue: string | string[]) => {
        if (unselectable && !newValue.length) return

        setInternalValue(newValue)
        onChange?.(newValue as any)
      },
      [onChange, unselectable]
    )

    const selectedValues = useMemo(() => {
      const map = new Map<string, boolean>()
      if (Array.isArray(internalValue)) {
        internalValue.forEach(val => map.set(val, true))
      } else {
        map.set(internalValue, true)
      }
      return map
    }, [internalValue])

    const contextValue = useMemo<ToggleGroupContextValue>(() => {
      const selectedVariant = variant === 'transparent' ? 'transparent' : selectedVariantProp

      return {
        variant,
        selectedVariant,
        size,
        disabled,
        selectedValues
      }
    }, [variant, selectedVariantProp, size, disabled, selectedValues])

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <ToggleGroupPrimitive.Root
          className={cn(
            'cn-toggle-group',
            { 'cn-toggle-group-vertical': props?.orientation === 'vertical' },
            className
          )}
          ref={ref}
          {...(type === 'single'
            ? {
                type: 'single',
                value: internalValue as string
              }
            : {
                type: 'multiple',
                value: internalValue as string[]
              })}
          onValueChange={handleValueChange}
          disabled={disabled}
          {...props}
        >
          {children}
        </ToggleGroupPrimitive.Root>
      </ToggleGroupContext.Provider>
    )
  }
)
ToggleGroupRoot.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & ToggleGroupItemProps
>(
  (
    {
      value,
      tooltipProps,
      disabled: itemDisabled,
      iconOnly,
      prefixIcon,
      prefixIconProps,
      suffixIcon,
      suffixIconProps,
      text,
      ...props
    },
    ref
  ) => {
    const {
      variant,
      selectedVariant,
      size,
      disabled: groupDisabled = false,
      selectedValues
    } = useContext(ToggleGroupContext)

    const buttonVariant = useMemo(() => {
      const isSelected = !!selectedValues.get(value)

      return isSelected ? selectedVariant : variant
    }, [variant, selectedVariant, selectedValues])

    const finalDisabled = groupDisabled || itemDisabled

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

    const accessibilityProps = iconOnly && text ? { 'aria-label': text } : {}

    return (
      <ToggleGroupPrimitive.Item ref={ref} asChild value={value} disabled={finalDisabled} {...props}>
        <Button
          className={toggleVariants({ size, variant, iconOnly })}
          variant={buttonVariant}
          size={size}
          disabled={finalDisabled}
          {...accessibilityProps}
          {...toButtonProps({ iconOnly, tooltipProps })}
        >
          {renderContent()}
        </Button>
      </ToggleGroupPrimitive.Item>
    )
  }
)
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem
}
