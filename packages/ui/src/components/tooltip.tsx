import {
  Children,
  cloneElement,
  ComponentProps,
  ComponentType,
  FocusEvent,
  forwardRef,
  ForwardRefExoticComponent,
  isValidElement,
  MouseEvent,
  PointerEvent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
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
  /**
   * When false (default), uncontrolled tooltips open on pointer hover only — not on focus.
   * Prevents stale tooltips after click or when returning to the browser window (Radix default opens on focus).
   * Ignored when `open` is set. Set true when tooltip content is essential for keyboard users (WCAG 1.4.13).
   */
  triggerOnFocus?: boolean
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
      triggerOnFocus = false,
      className,
      sideOffset
    },
    ref
  ) => {
    const { portalContainer } = usePortal()
    const { theme: currentTheme } = useTheme()
    const isControlledOpen = open !== undefined
    const hoverOnly = !isControlledOpen && !triggerOnFocus
    const [hoverOpen, setHoverOpen] = useState(false)
    const isPointerOverTriggerRef = useRef(false)
    const openDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearOpenDelayTimer = useCallback(() => {
      if (openDelayTimerRef.current !== null) {
        clearTimeout(openDelayTimerRef.current)
        openDelayTimerRef.current = null
      }
    }, [])

    const setHoverOpenSafe = useCallback((next: boolean) => {
      setHoverOpen(next)
    }, [])

    const handleOpenChange = useCallback(
      (next: boolean) => {
        if (!hoverOnly) return
        // Radix opens on focus when the window is refocused; allow open only during pointer hover.
        if (next && !isPointerOverTriggerRef.current) return
        setHoverOpenSafe(next)
      },
      [hoverOnly, setHoverOpenSafe]
    )

    useEffect(() => {
      if (!hoverOnly) return
      const closeOnWindowBlur = () => {
        isPointerOverTriggerRef.current = false
        clearOpenDelayTimer()
        setHoverOpenSafe(false)
      }
      window.addEventListener('blur', closeOnWindowBlur)
      return () => {
        window.removeEventListener('blur', closeOnWindowBlur)
        clearOpenDelayTimer()
      }
    }, [hoverOnly, clearOpenDelayTimer, setHoverOpenSafe])

    const rootOpen = isControlledOpen ? open : hoverOnly ? hoverOpen : undefined

    const triggerChild = useMemo(() => {
      if (!hoverOnly) return children
      const child = Children.only(children)
      if (!isValidElement(child)) return children

      return cloneElement(child, {
        onPointerEnter: (event: PointerEvent<HTMLElement>) => {
          isPointerOverTriggerRef.current = true
          clearOpenDelayTimer()
          const delayMs = delay ?? 0
          if (delayMs <= 0) {
            setHoverOpenSafe(true)
          } else {
            openDelayTimerRef.current = setTimeout(() => {
              openDelayTimerRef.current = null
              if (isPointerOverTriggerRef.current) setHoverOpenSafe(true)
            }, delayMs)
          }
          child.props.onPointerEnter?.(event)
        },
        onPointerLeave: (event: PointerEvent<HTMLElement>) => {
          isPointerOverTriggerRef.current = false
          clearOpenDelayTimer()
          setHoverOpenSafe(false)
          child.props.onPointerLeave?.(event)
        },
        onBlur: (event: FocusEvent<HTMLElement>) => {
          isPointerOverTriggerRef.current = false
          clearOpenDelayTimer()
          setHoverOpenSafe(false)
          child.props.onBlur?.(event)
        },
        onClick: (event: MouseEvent<HTMLElement>) => {
          isPointerOverTriggerRef.current = false
          clearOpenDelayTimer()
          setHoverOpenSafe(false)
          child.props.onClick?.(event)
        }
      })
    }, [children, clearOpenDelayTimer, delay, hoverOnly, setHoverOpenSafe])

    // Automatically increase sideOffset when arrow is hidden
    const computedSideOffset = sideOffset ?? (hideArrow ? 6 : 2)

    // The tooltip surface is always dark, so its subtree resolves dark-mode tokens.
    const tooltipTheme = useMemo(() => toDarkMode(currentTheme ?? defaultTheme), [currentTheme])

    return (
      <TooltipPrimitive.Root
        delayDuration={delay}
        open={rootOpen}
        onOpenChange={hoverOnly ? handleOpenChange : undefined}
      >
        <TooltipPrimitive.Trigger asChild>{triggerChild}</TooltipPrimitive.Trigger>
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
