import { ComponentProps, FC, ReactNode } from 'react'

import TooltipArrowIcon from '@/icons/tooltip-arrow.svg'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type TooltipPrimitiveRootType = ComponentProps<typeof TooltipPrimitive.Root>
type TooltipPrimitiveContentType = ComponentProps<typeof TooltipPrimitive.Content>

export type TooltipProps = {
  children: ReactNode
  title?: string
  content: ReactNode
  hideArrow?: boolean
  delay?: TooltipPrimitiveRootType['delayDuration']
} & Pick<TooltipPrimitiveContentType, 'side' | 'align'>

export const Tooltip: FC<TooltipProps> = ({
  children,
  title,
  content,
  hideArrow = false,
  delay = 700,
  side = 'top',
  align = 'center'
}) => {
  return (
    <TooltipPrimitive.Root delayDuration={delay}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content className="cn-tooltip" side={side} align={align} sideOffset={4}>
        {!!title && <span className="cn-tooltip-title">{title}</span>}
        <div>{content}</div>
        {!hideArrow && (
          <TooltipPrimitive.Arrow width={20} height={8} asChild>
            <div className="cn-tooltip-arrow">
              <TooltipArrowIcon />
            </div>
          </TooltipPrimitive.Arrow>
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  )
}

export const TooltipProvider = TooltipPrimitive.Provider
