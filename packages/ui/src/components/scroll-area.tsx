import { ComponentPropsWithoutRef, ElementRef, forwardRef, useRef, useState } from 'react'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@utils/cn'

export type ScrollAreaProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  viewportClassName?: string
  scrollThumbClassName?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
  scrollBarProps?: ScrollBarProps & {
    vertical?: ScrollBarProps
    horizontal?: ScrollBarProps
  }
}

const ScrollArea = forwardRef<ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(
  (
    {
      className,
      children,
      viewportClassName,
      scrollThumbClassName,
      orientation = 'vertical',
      scrollBarProps,
      ...props
    },
    ref
  ) => {
    const [isScrolling, setIsScrolling] = useState(false)
    const timeoutRef = useRef<number | null>(null)

    const isVertical = orientation === 'vertical' || orientation === 'both'
    const isHorizontal = orientation === 'horizontal' || orientation === 'both'

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

    const getScrollBarProps = (orientation: 'vertical' | 'horizontal') => ({
      orientation,
      ...scrollBarProps,
      ...scrollBarProps?.[orientation],
      className: cn(
        { 'opacity-100': isScrolling },
        scrollBarProps?.className,
        scrollBarProps?.[orientation]?.className
      ),
      scrollThumbClassName: cn(
        scrollThumbClassName,
        scrollBarProps?.scrollThumbClassName,
        scrollBarProps?.[orientation]?.scrollThumbClassName
      )
    })

    return (
      <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden flex-1', className)} {...props}>
        <ScrollAreaPrimitive.Viewport
          className={cn('size-full rounded-[inherit] [&>div]:!flex [&>div]:flex-col', viewportClassName)}
          onScroll={handleScroll}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>

        {isVertical && <ScrollBar {...getScrollBarProps('vertical')} />}
        {isHorizontal && <ScrollBar {...getScrollBarProps('horizontal')} />}
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    )
  }
)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

type ScrollBarProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
  scrollThumbClassName?: string
}

const ScrollBar = forwardRef<ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>, ScrollBarProps>(
  ({ className, orientation = 'vertical', scrollThumbClassName, ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'group absolute z-10 flex p-1 touch-none select-none opacity-0 hover:opacity-100 transition-opacity',
        orientation === 'vertical' && 'right-0 top-0 h-full w-3.5 border-l border-l-transparent ',
        orientation === 'horizontal' && 'bottom-0 left-0 h-3.5 flex-col border-t border-t-transparent',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        className={cn('relative flex-1 rounded-full bg-background-9', scrollThumbClassName)}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
)
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
