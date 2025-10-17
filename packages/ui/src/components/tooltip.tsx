import {
  ComponentProps,
  ComponentType,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes
} from 'react'

import { usePortal } from '@/context'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@utils/cn'

import { Illustration } from './illustration'

type TooltipPrimitiveRootType = ComponentProps<typeof TooltipPrimitive.Root>
type TooltipPrimitiveContentType = ComponentProps<typeof TooltipPrimitive.Content>

export type TooltipProps = {
  children: ReactNode
  title?: string
  content: ReactNode
  hideArrow?: boolean
  delay?: TooltipPrimitiveRootType['delayDuration']
  open?: boolean
} & Pick<TooltipPrimitiveContentType, 'side' | 'align' | 'className'>

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    { children, title, content, hideArrow = false, delay = 500, side = 'top', align = 'center', open, className },
    ref
  ) => {
    const { portalContainer } = usePortal()
    return (
      <TooltipPrimitive.Root delayDuration={delay} open={open}>
        <TooltipPrimitive.Trigger asChild className="test">
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={portalContainer}>
          <TooltipPrimitive.Content
            ref={ref}
            className={cn('cn-tooltip', className)}
            side={side}
            align={align}
            sideOffset={4}
          >
            {!!title && <span className="cn-tooltip-title">{title}</span>}
            <div>{content}</div>
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
 * !!! for the HOC to work correctly, the component must use forwardRef.
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
