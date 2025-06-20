import {
  ComponentPropsWithoutRef,
  ElementRef,
  FC,
  forwardRef,
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import { Button, ButtonProps, ButtonSizes, ButtonVariants, Tooltip, TooltipProps } from '@/components'
import * as TogglePrimitive from '@radix-ui/react-toggle'

type ToggleVariant = 'outline-primary' | 'outline-secondary' | 'ghost-primary' | 'ghost-secondary'
type ToggleTooltipProps = Pick<TooltipProps, 'title' | 'content' | 'side' | 'align'>

export interface ToggleProps extends Pick<ButtonProps, 'rounded' | 'iconOnly'> {
  variant?: ToggleVariant
  size?: ButtonSizes
  tooltipProps?: ToggleTooltipProps
}

const TooltipWrapper: FC<{ children: ReactNode; tooltipProps?: ToggleTooltipProps }> = ({ children, tooltipProps }) =>
  tooltipProps ? <Tooltip {...tooltipProps}>{children}</Tooltip> : <>{children}</>

const Toggle = forwardRef<
  ElementRef<typeof TogglePrimitive.Root>,
  ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & ToggleProps
>(
  (
    {
      className,
      variant = 'outline-primary',
      size = 'md',
      pressed: pressedProp = false,
      rounded,
      iconOnly,
      children,
      onPressedChange,
      disabled,
      tooltipProps
    },
    ref
  ) => {
    const [pressed, setPressed] = useState(pressedProp)

    const buttonVariant = useMemo(() => {
      const [inactiveVariant, activeVariant] = variant.split('-') as [ButtonVariants, ButtonVariants]
      return pressed ? activeVariant : inactiveVariant
    }, [variant, pressed])

    useEffect(() => {
      setPressed(pressedProp)
    }, [pressedProp])

    const onChange = useCallback(
      (val: boolean) => {
        setPressed(val)
        onPressedChange?.(val)
      },
      [onPressedChange]
    )

    return (
      <TooltipWrapper tooltipProps={tooltipProps}>
        <TogglePrimitive.Root ref={ref} asChild pressed={pressed} onPressedChange={onChange} disabled={disabled}>
          <Button
            className={className}
            variant={buttonVariant}
            disabled={disabled}
            size={size}
            rounded={rounded}
            iconOnly={iconOnly}
          >
            {children}
          </Button>
        </TogglePrimitive.Root>
      </TooltipWrapper>
    )
  }
)
Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle }
