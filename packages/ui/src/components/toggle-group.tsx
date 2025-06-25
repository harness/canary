import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  FC,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { Button, ButtonSizes, ButtonVariants, Tooltip, TooltipProps } from '@/components'
import { cn } from '@/utils'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'

type ToggleGroupVariant = 'outline-primary' | 'outline-secondary' | 'ghost-primary' | 'ghost-secondary'
type ToggleTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>
type SelectedValuesProp = Map<string, boolean>

interface ToggleGroupContextValue {
  variant: ToggleGroupVariant
  size: ButtonSizes
  disabled?: boolean
  selectedValues: SelectedValuesProp
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  variant: 'outline-primary',
  size: 'md',
  selectedValues: new Map<string, boolean>()
})

export interface ToggleGroupProps
  extends Omit<ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, 'defaultValue' | 'type' | 'unselectable'> {
  type?: ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>['type']
  variant?: ToggleGroupVariant
  size?: ButtonSizes
  disabled?: boolean
  className?: string
  unselectable?: boolean
}

export interface ToggleGroupItemProps {
  value: string
  tooltipProps?: ToggleTooltipProps
  disabled?: boolean
  iconOnly?: boolean
  children?: ReactNode
}

const TooltipWrapper: FC<{ children: ReactNode; tooltipProps?: ToggleTooltipProps }> = ({ children, tooltipProps }) =>
  tooltipProps ? <Tooltip {...tooltipProps}>{children}</Tooltip> : <>{children}</>

const ToggleGroupRoot = forwardRef<ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  (
    {
      children,
      variant = 'outline-primary',
      size = 'md',
      disabled = false,
      type = 'single',
      value,
      onValueChange,
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
        onValueChange?.(newValue as any)
      },
      [onValueChange, unselectable]
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

    const contextValue = useMemo<ToggleGroupContextValue>(
      () => ({
        variant,
        size,
        disabled,
        selectedValues
      }),
      [variant, size, disabled, selectedValues]
    )

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
>(({ value, tooltipProps, disabled: itemDisabled, iconOnly, children, ...props }, ref) => {
  const { variant, size, disabled: groupDisabled = false, selectedValues } = useContext(ToggleGroupContext)

  const buttonVariant = useMemo(() => {
    const [inactiveVariant, activeVariant] = variant.split('-') as [ButtonVariants, ButtonVariants]
    const isPressed = !!selectedValues.get(value)

    return isPressed ? activeVariant : inactiveVariant
  }, [variant, selectedValues])

  const finalDisabled = groupDisabled || itemDisabled

  return (
    <TooltipWrapper tooltipProps={tooltipProps}>
      <ToggleGroupPrimitive.Item ref={ref} asChild value={value} disabled={finalDisabled} {...props}>
        <Button variant={buttonVariant} size={size} disabled={finalDisabled} iconOnly={iconOnly}>
          {children}
        </Button>
      </ToggleGroupPrimitive.Item>
    </TooltipWrapper>
  )
})
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem
}
