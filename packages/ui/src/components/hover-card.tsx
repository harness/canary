import * as React from 'react'

import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import { cn } from '@utils/cn'

const HoverCardRoot = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardArrow = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Arrow>,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Arrow ref={ref} asChild>
    <div
      className={cn('bg-cn-background-2 size-1.5 border-t border-l rotate-[225deg] -m-[55%] rounded-[1px]', className)}
      {...props}
    />
  </HoverCardPrimitive.Arrow>
))
HoverCardArrow.displayName = HoverCardPrimitive.Arrow.displayName

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, children, align = 'center', sideOffset = 6, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'bg-cn-background-2 text-cn-foreground-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 rounded border p-4 shadow-1 outline-none',
      className
    )}
    {...props}
  >
    {children}
    <HoverCardArrow />
  </HoverCardPrimitive.Content>
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent
}

export { HoverCard }
