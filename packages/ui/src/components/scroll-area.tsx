import { FC, ReactNode, useRef, useState } from 'react'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@utils/cn'

const SCROLL_TIMEOUT = 1000

type ScrollBarProps = {
  className?: string
  orientation?: 'vertical' | 'horizontal'
}

const ScrollBar: FC<ScrollBarProps> = ({ className, orientation = 'vertical', ...props }) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
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

export type ScrollAreaProps = Pick<ScrollAreaPrimitive.ScrollAreaProps, 'dir'> & {
  className?: string
  children: ReactNode
  viewportClassName?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
}

const ScrollArea: FC<ScrollAreaProps> = ({ className, children, viewportClassName, orientation = 'vertical', dir }) => {
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
    }, SCROLL_TIMEOUT)
  }

  return (
    <ScrollAreaPrimitive.Root className={cn('cn-scroll-area cn-scroll-area-hover', className)} dir={dir}>
      <ScrollAreaPrimitive.Viewport
        className={cn('cn-scroll-area-viewport', viewportClassName)}
        onScroll={handleScroll}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      {isVertical && <ScrollBar className={cn({ 'cn-scroll-area-visible': isScrolling })} />}
      {isHorizontal && <ScrollBar className={cn({ 'cn-scroll-area-visible': isScrolling })} orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export { ScrollArea }
