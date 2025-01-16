import * as React from 'react'

import { usePortal } from '@/context'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@utils/cn'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className = 'w-72', align = 'center', sideOffset = 4, ...props }, ref) => {
  const { portalContainer } = usePortal()
  return (
    <PopoverPrimitive.Portal container={portalContainer}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn('bg-background-2 text-foreground-1 shadow-1 z-50 rounded border p-4 outline-none', className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
