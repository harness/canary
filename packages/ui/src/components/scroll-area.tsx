import { ComponentPropsWithoutRef, ElementRef, forwardRef, UIEventHandler, useRef, useState } from 'react'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@utils/cn'

export type ScrollAreaProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  viewportClassName?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
  scrollBarProps?: ScrollBarProps & {
    vertical?: ScrollBarProps
    horizontal?: ScrollBarProps
  }
}

const SCROLL_TIMEOUT = 1000

const ScrollArea = forwardRef<ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(
  (
    {
      className,
      children,
      viewportClassName,
      orientation = 'vertical',
      scrollBarProps,
      onScroll,
      type = 'auto',
      ...props
    },
    ref
  ) => {
    const [isScrolling, setIsScrolling] = useState(false)
    const timeoutRef = useRef<number | null>(null)

    const isVertical = orientation === 'vertical' || orientation === 'both'
    const isHorizontal = orientation === 'horizontal' || orientation === 'both'

    const handleScroll: UIEventHandler<HTMLDivElement> = event => {
      setIsScrolling(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      onScroll?.(event)

      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false)
        timeoutRef.current = null
      }, SCROLL_TIMEOUT)
    }

    const getScrollBarProps = (orientation: 'vertical' | 'horizontal') => ({
      orientation,
      ...scrollBarProps,
      ...scrollBarProps?.[orientation],
      className: cn(
        { 'cn-scroll-area-visible': isScrolling || type === 'always' || type === 'auto' },
        scrollBarProps?.className,
        scrollBarProps?.[orientation]?.className
      )
    })

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn(
          'cn-scroll-area',
          {
            'cn-scroll-area-hover': type === 'hover'
          },
          className
        )}
        type={type}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          className={cn('cn-scroll-area-viewport', viewportClassName)}
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

type ScrollBarProps = ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>

const ScrollBar = forwardRef<ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>, ScrollBarProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'cn-scroll-area-scrollbar',
        {
          'cn-scroll-area-scrollbar-vertical': orientation === 'vertical',
          'cn-scroll-area-scrollbar-horizontal': orientation === 'horizontal'
        },
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="cn-scroll-area-thumb" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
)
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea }
