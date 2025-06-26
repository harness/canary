import { ElementRef, FC, forwardRef, Fragment, ReactNode, useCallback, useState } from 'react'

import { Button, ButtonProps, ButtonSizes, IconPropsV2, IconV2, Tooltip, TooltipProps } from '@/components'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cn } from '@utils/cn'

type ToggleVariant = 'ghost' | 'outline' | 'transparent'
type TypeSelectedVariant = 'primary' | 'secondary'
type ToggleTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>

export interface ToggleProps extends Pick<ButtonProps, 'rounded' | 'iconOnly' | 'disabled'> {
  variant?: ToggleVariant
  selectedVariant?: TypeSelectedVariant
  onChange?: (selected: boolean) => void
  text?: string
  size?: ButtonSizes
  prefixIcon?: IconPropsV2['name']
  suffixIcon?: IconPropsV2['name']
  selected?: boolean
  defaultValue?: boolean
  tooltipProps?: ToggleTooltipProps
  className?: string
}

const TooltipWrapper: FC<{ children: ReactNode; tooltipProps?: ToggleTooltipProps }> = ({ children, tooltipProps }) =>
  tooltipProps ? <Tooltip {...tooltipProps}>{children}</Tooltip> : <>{children}</>

const Toggle = forwardRef<ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  (
    {
      className,
      variant = 'outline',
      selectedVariant = 'primary',
      size = 'md',
      rounded,
      disabled,
      iconOnly,
      text,
      prefixIcon,
      suffixIcon,
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

    const handleChange = useCallback(
      (val: boolean) => {
        if (!isControlled) {
          setInternalSelected(val)
        }
        onChange?.(val)
      },
      [isControlled, onChange]
    )

    const accessibilityProps = iconOnly && text ? { 'aria-label': text } : {}

    const renderContent = () => {
      if (iconOnly) {
        return prefixIcon ? <IconV2 name={prefixIcon} size={size} /> : null
      }

      return (
        <>
          {prefixIcon && <IconV2 name={prefixIcon} size={size} />}
          {text}
          {suffixIcon && <IconV2 name={suffixIcon} size={size} />}
        </>
      )
    }

    return (
      <TooltipWrapper tooltipProps={tooltipProps}>
        <TogglePrimitive.Root ref={ref} asChild pressed={selected} onPressedChange={handleChange} disabled={disabled}>
          <Button
            className={cn(className, { [`cn-toggle-transparent-${size}`]: variant === 'transparent' && !iconOnly })}
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
