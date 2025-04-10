import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { Arrow, Content, Provider, Root, Trigger } from '@radix-ui/react-tooltip'
import { cn } from '@utils/cn'

const TooltipContent = forwardRef<ElementRef<typeof Content>, ComponentPropsWithoutRef<typeof Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'bg-cn-background-2 text-cn-foreground-1 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs',
        className
      )}
      {...props}
    />
  )
)
TooltipContent.displayName = Content.displayName

const TooltipArrow = forwardRef<ElementRef<typeof Arrow>, ComponentPropsWithoutRef<typeof Arrow>>(
  ({ className, ...props }, ref) => (
    <Arrow ref={ref} width={16} height={10} className={cn('fill-cn-background-2', className)} {...props} />
  )
)
TooltipArrow.displayName = Arrow.displayName

const Tooltip = {
  Root,
  Trigger,
  Content: TooltipContent,
  Provider,
  Arrow: TooltipArrow
}

export { Tooltip }
