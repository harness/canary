import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

import { usePortal } from '@/context'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@utils/cn'

const PopoverRoot = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className = 'w-72', align = 'center', sideOffset = 4, ...props }, ref) => {
  const { portalContainer } = usePortal()

  return (
    <PopoverPrimitive.Portal container={portalContainer}>
      <PopoverPrimitive.Content
        className={cn(
          'bg-background-2 text-foreground-1 shadow-1 z-50 rounded border p-4 outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className
        )}
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
})
PopoverContent.displayName = PopoverPrimitive.Content.displayName

const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Anchor: PopoverAnchor
}

export { Popover }
