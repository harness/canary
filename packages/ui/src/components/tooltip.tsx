import { ComponentProps, ComponentPropsWithoutRef, ElementRef, FC, forwardRef, ReactNode } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@utils/cn'

// const TooltipContent = forwardRef<ElementRef<typeof Content>, ComponentPropsWithoutRef<typeof Content>>(
//   ({ className, sideOffset = 4, ...props }, ref) => (
//     <Content
//       ref={ref}
//       sideOffset={sideOffset}
//       className={cn(
//         'bg-cn-background-3 border-cn-borders-2 border text-cn-foreground-1 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 rounded-md px-3 py-1.5 text-2 [&>span[style]]:bg-cn-background-3 [&>span[style]]:size-1.5 [&>span[style]]:border-t [&>span[style]]:border-l [&>span[style]]:!translate-y-[calc(100%-3px)] [&>span[style]]:!scale-100 [&>span[style]]:!rotate-[225deg] [&>span[style]]:rounded-[1px]',
//         className
//       )}
//       {...props}
//     />
//   )
// )
// TooltipContent.displayName = Content.displayName
//
// const TooltipArrow = forwardRef<ElementRef<typeof Arrow>, ComponentPropsWithoutRef<typeof Arrow>>((props, ref) => (
//   <Arrow ref={ref} {...props} asChild />
// ))
// TooltipArrow.displayName = Arrow.displayName
//
// const Tooltip = {
//   Root,
//   Trigger,
//   Content: TooltipContent,
//   Provider,
//   Arrow: TooltipArrow
// }
//
// // export { Tooltip, type TooltipProps }

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
      <TooltipPrimitive.Content className="cn-tooltip" side={side} align={align}>
        {!!title && <span className="cn-tooltip-title">{title}</span>}
        {content}
        {!hideArrow && <TooltipPrimitive.Arrow width={16} height={8} />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  )
}

export const TooltipProvider = TooltipPrimitive.Provider
