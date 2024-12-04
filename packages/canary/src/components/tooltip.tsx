import * as React from 'react'

import { cn } from '@/lib/utils'
import { Arrow, Content, Provider, Root, Trigger } from '@radix-ui/react-tooltip'

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs',
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = Content.displayName

export {
  Root as Tooltip,
  Trigger as TooltipTrigger,
  TooltipContent,
  Provider as TooltipProvider,
  Arrow as TooltipArrow
}
