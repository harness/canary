import { ComponentProps, FC, ReactNode } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

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
} & Pick<TooltipPrimitiveContentType, 'side' | 'align'>

export const Tooltip: FC<TooltipProps> = ({
  children,
  title,
  content,
  hideArrow = false,
  delay = 500,
  side = 'top',
  align = 'center',
  open
}) => {
  return (
    <TooltipPrimitive.Root delayDuration={delay} open={open}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content className="cn-tooltip" side={side} align={align} sideOffset={4}>
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

export const TooltipProvider = (props: ComponentProps<typeof TooltipPrimitive.Provider>) => (
  <TooltipPrimitive.Provider skipDelayDuration={0} {...props} />
)
