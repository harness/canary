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
import { ColorType, ContrastType, defaultTheme, FullTheme, ModeType, useTheme } from '@/context/theme'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@utils/cn'

import { Illustration } from './illustration'

type TooltipPrimitiveRootType = ComponentProps<typeof TooltipPrimitive.Root>
type TooltipPrimitiveContentType = ComponentProps<typeof TooltipPrimitive.Content>

/**
 * Forces the dark mode while preserving color and contrast variants
 */
function toDarkMode(theme: FullTheme): FullTheme | ModeType.Dark {
  const parts = theme.split('-')
  if (parts.length !== 3) return ModeType.Dark

  const [, color, contrast] = parts as [string, ColorType, ContrastType]

  if (!theme || !color || !contrast) return ModeType.Dark

  return `${ModeType.Dark}-${color}-${contrast}` as FullTheme
}

export type TooltipProps = {
  children: ReactNode
  title?: string
  content: ReactNode
  footer?: ReactNode
  hideArrow?: boolean
  delay?: TooltipPrimitiveRootType['delayDuration']
  open?: boolean
} & Pick<TooltipPrimitiveContentType, 'side' | 'align' | 'className' | 'sideOffset'>

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      children,
      title,
      content,
      footer,
      hideArrow = false,
      delay = 400,
      side = 'top',
      align = 'center',
      open,
      className,
      sideOffset
    },
    ref
  ) => {
    const { portalContainer } = usePortal()
    const { theme: currentTheme } = useTheme()

    // Automatically increase sideOffset when arrow is hidden
    const computedSideOffset = sideOffset ?? (hideArrow ? 6 : 2)

    // The tooltip surface is always dark, so its subtree resolves dark-mode tokens.
    const tooltipTheme = useMemo(() => toDarkMode(currentTheme ?? defaultTheme), [currentTheme])

    return (
      <TooltipPrimitive.Root delayDuration={delay} open={open}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={portalContainer}>
          <TooltipPrimitive.Content
            ref={ref}
            className={cn(
              'cn-tooltip',
              tooltipTheme,
              'animate-in fade-in-50 zoom-in-97 duration-150 ease-out',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-97',
              'data-[side=bottom]:slide-in-from-top-slide-offset',
              'data-[side=left]:slide-in-from-right-slide-offset',
              'data-[side=right]:slide-in-from-left-slide-offset',
              'data-[side=top]:slide-in-from-bottom-slide-offset',
              className
            )}
            side={side}
            align={align}
            sideOffset={computedSideOffset}
          >
            <div className="cn-tooltip-content">
              {!!title && <span className="cn-tooltip-title">{title}</span>}
              <div className="cn-tooltip-content-body">{content}</div>
              {!!footer && <div className="cn-tooltip-content-footer">{footer}</div>}
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
