import {
  ComponentProps,
  ComponentType,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
  useMemo
} from 'react'

import { usePortal } from '@/context'
import { useTheme, ModeType, ColorType, ContrastType, FullTheme } from '@/context/theme'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@utils/cn'

import { Illustration } from './illustration'

type TooltipPrimitiveRootType = ComponentProps<typeof TooltipPrimitive.Root>
type TooltipPrimitiveContentType = ComponentProps<typeof TooltipPrimitive.Content>

/**
 * Swaps the mode (light ↔ dark) while preserving color and contrast variants
 */
function swapMode(theme: FullTheme): FullTheme {
  const parts = theme.split('-')
  if (parts.length !== 3) return theme

  const [, color, contrast] = parts as [string, ColorType, ContrastType]
  const currentMode = parts[0] as ModeType

  // Swap light ↔ dark
  const swappedMode = currentMode === ModeType.Light ? ModeType.Dark : ModeType.Light

  return `${swappedMode}-${color}-${contrast}` as FullTheme
}

/**
 * Detects if content is custom (not just a simple string)
 */
function isCustomContent(content: ReactNode): boolean {
  // If content is not a string, it's custom (React components, JSX, etc.)
  return typeof content !== 'string'
}

export type TooltipProps = {
  children: ReactNode
  title?: string
  content: ReactNode
  hideArrow?: boolean
  delay?: TooltipPrimitiveRootType['delayDuration']
  open?: boolean
  /**
   * Theme variant of the tooltip
   * - 'default': High-contrast appearance with fixed colors
   * - 'themed': Follows the current theme's color palette
   * @default 'default'
   */
  theme?: 'default' | 'themed'
} & Pick<TooltipPrimitiveContentType, 'side' | 'align' | 'className' | 'sideOffset'>

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      title,
      content,
      hideArrow = false,
      delay = 400,
      side = 'top',
      align = 'center',
      open,
      theme = 'default',
      className,
      sideOffset
    },
    ref
  ) => {
    const { portalContainer } = usePortal()
    const { theme: currentTheme } = useTheme()

    // Automatically increase sideOffset when arrow is hidden
    const computedSideOffset = sideOffset ?? (hideArrow ? 6 : 2)

    // Auto-swap mode for custom content in default theme
    const shouldSwapMode = useMemo(() => {
      return theme === 'default' && isCustomContent(content) && currentTheme
    }, [theme, content, currentTheme])

    const tooltipTheme = useMemo(() => {
      if (shouldSwapMode && currentTheme) {
        return swapMode(currentTheme)
      }
      return currentTheme
    }, [shouldSwapMode, currentTheme])

    return (
      <TooltipPrimitive.Root delayDuration={delay} open={open}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={portalContainer}>
          <TooltipPrimitive.Content
            ref={ref}
            className={cn(
              'cn-tooltip',
              'animate-in fade-in-0 zoom-in-95 duration-150',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              'data-[side=bottom]:slide-in-from-top-2',
              'data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2',
              'data-[side=top]:slide-in-from-bottom-2',
              {
                ['cn-tooltip-default']: theme === 'default'
              },
              // Apply theme switching class for custom content in default theme
              shouldSwapMode && tooltipTheme && `theme-${tooltipTheme}`,
              className
            )}
            data-theme={shouldSwapMode ? tooltipTheme : undefined}
            side={side}
            align={align}
            sideOffset={computedSideOffset}
          >
            <div className="cn-tooltip-content">
              {!!title && <span className="cn-tooltip-title">{title}</span>}
              <div>{content}</div>
            </div>
            {!hideArrow && (
              <TooltipPrimitive.Arrow width={20} height={8} asChild>
                <Illustration className="cn-tooltip-arrow" name="tooltip-arrow" />
              </TooltipPrimitive.Arrow>
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    )
  }
)
Tooltip.displayName = 'Tooltip'

export const TooltipProvider = (props: ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider skipDelayDuration={0} {...props} />
)

type WithTooltipProp = {
  tooltipProps?: Omit<TooltipProps, 'children'>
}

/**
 * HOC for adding Tooltip support to any component.
 * !!! for the HOC to work correctly, the component must use forwardRef and spread props.
 */
export function withTooltip<P>(
  Component: ComponentType<P>
): ForwardRefExoticComponent<PropsWithoutRef<P & WithTooltipProp> & RefAttributes<any>> {
  const Wrapped = forwardRef<any, P & WithTooltipProp>(({ tooltipProps, ...rest }, ref) => {
    const child = <Component ref={ref} {...(rest as P)} />

    if (!tooltipProps) return child

    return <Tooltip {...tooltipProps}>{child}</Tooltip>
  })

  Wrapped.displayName = `withTooltip(${Component.displayName || Component?.name || 'Component'})`

  return Wrapped
}
