import { FC, ReactNode, useCallback, useLayoutEffect, useRef } from 'react'

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@utils/cn'

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

type ScrollPosition = {
  isTop: boolean
  isBottom: boolean
  isLeft: boolean
  isRight: boolean
}

export type ScrollAreaProps = {
  className?: string
  children: ReactNode
  viewportClassName?: string
  orientation?: 'vertical' | 'horizontal' | 'both'
  onScroll?: (position: ScrollPosition) => void
  direction?: 'ltr' | 'rtl'
}

const ScrollArea: FC<ScrollAreaProps> = ({
  className,
  children,
  viewportClassName,
  orientation = 'vertical',
  direction,
  onScroll
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null)

  const prevPositionRef = useRef<ScrollPosition | null>(null)

  const handleScroll = useCallback(() => {
    const el = viewportRef.current
    if (!el || !onScroll) return

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el

    const isTop = scrollTop === 0
    const isBottom = scrollTop + clientHeight >= scrollHeight - 1

    let isLeft: boolean, isRight: boolean

    if (direction === 'rtl') {
      const offset = Math.abs(scrollLeft)
      isRight = offset === 0
      isLeft = offset + clientWidth >= scrollWidth - 1
    } else {
      isLeft = scrollLeft === 0
      isRight = scrollLeft + clientWidth >= scrollWidth - 1
    }

    const newPosition: ScrollPosition = { isTop, isBottom, isLeft, isRight }

    const prev = prevPositionRef.current
    const changed =
      !prev ||
      prev.isTop !== newPosition.isTop ||
      prev.isBottom !== newPosition.isBottom ||
      prev.isLeft !== newPosition.isLeft ||
      prev.isRight !== newPosition.isRight

    if (changed) {
      prevPositionRef.current = newPosition
      onScroll(newPosition)
    }
  }, [direction, onScroll])

  const isVertical = orientation === 'vertical' || orientation === 'both'
  const isHorizontal = orientation === 'horizontal' || orientation === 'both'

  useLayoutEffect(() => {
    handleScroll()
  }, [handleScroll])

  return (
    <ScrollAreaPrimitive.Root className={cn('cn-scroll-area cn-scroll-area-hover', className)} dir={direction}>
      <ScrollAreaPrimitive.Viewport
        className={cn('cn-scroll-area-viewport', viewportClassName)}
        onScroll={handleScroll}
        ref={viewportRef}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      {isVertical && <ScrollBar />}
      {isHorizontal && <ScrollBar orientation="horizontal" />}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

export { ScrollArea }
