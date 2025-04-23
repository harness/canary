import { ComponentPropsWithoutRef, ElementRef, forwardRef, HTMLAttributes } from 'react'

import { Arrow, Content, Provider, Root, Trigger } from '@radix-ui/react-tooltip'
import { cn } from '@utils/cn'

const TooltipContent = forwardRef<ElementRef<typeof Content>, ComponentPropsWithoutRef<typeof Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'bg-cn-background-3 border-cn-borders-2 border text-cn-foreground-1 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-2',
        className
      )}
      {...props}
    />
  )
)
TooltipContent.displayName = Content.displayName

const TooltipArrow = forwardRef<ElementRef<typeof Arrow>, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Arrow ref={ref} asChild>
      <div
        className={cn(
          'bg-cn-background-3 size-1.5 border-t border-l rotate-[225deg] -m-[55%] rounded-[1px]',
          className
        )}
        {...props}
      />
    </Arrow>
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
