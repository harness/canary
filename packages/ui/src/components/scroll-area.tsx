import * as React from 'react'
import { useRef, useState } from 'react'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@utils/cn'

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    viewportClassName?: string
    scrollThumbClassName?: string
  }
>(({ className, children, viewportClassName, scrollThumbClassName, ...props }, ref) => {
  const [isScrolling, setIsScrolling] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const handleScroll = () => {
    setIsScrolling(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false)
      timeoutRef.current = null
    }, 1000)
  }

  return (
    <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden flex-1', className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        className={cn('size-full rounded-[inherit] [&>div]:!flex [&>div]:flex-col', viewportClassName)}
        onScroll={handleScroll}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar className={isScrolling ? 'opacity-100' : undefined} scrollThumbClassName={scrollThumbClassName} />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    scrollThumbClassName?: string
  }
>(({ className, orientation = 'vertical', scrollThumbClassName, ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'group absolute z-10 flex touch-none select-none opacity-0 hover:opacity-100 transition-opacity',
      orientation === 'vertical' && 'right-0 top-0 h-full w-3.5 border-l border-l-transparent p-1',
      orientation === 'horizontal' && 'bottom-0 left-0 h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn('relative flex-1 rounded-full bg-background-9', scrollThumbClassName)}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
