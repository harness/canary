import { FC, ReactNode, UIEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { cn } from '@utils/cn'
import debounce from 'lodash-es/debounce'

type ScrollPosition = {
  isTop: boolean
  isBottom: boolean
  isLeft: boolean
  isRight: boolean
}

export type ScrollAreaProps = {
  className?: string
  children: ReactNode
  onScroll?: (event: UIEvent<HTMLDivElement>, position?: ScrollPosition) => void
  direction?: 'ltr' | 'rtl'
  debounceDelay?: number
}

const ScrollArea: FC<ScrollAreaProps> = ({ className, children, direction, onScroll, debounceDelay = 0 }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null)

  const computePosition = useCallback(
    (el: HTMLDivElement): ScrollPosition => {
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

      return { isTop, isBottom, isLeft, isRight }
    },
    [direction]
  )

  const debouncedHandleScroll = useMemo(() => {
    if (!debounceDelay) return null

    return debounce((el: HTMLDivElement) => {
      if (!onScroll) return
      const fakeEvent = { currentTarget: el } as UIEvent<HTMLDivElement>
      onScroll(fakeEvent, computePosition(el))
    }, debounceDelay)
  }, [onScroll, computePosition, debounceDelay])

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget
      if (!el || !onScroll) return

      if (debouncedHandleScroll) {
        debouncedHandleScroll(el)
      } else {
        onScroll(event, computePosition(el))
      }
    },
    [onScroll, computePosition, debouncedHandleScroll]
  )

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (el && onScroll) {
      const fakeEvent = { currentTarget: el } as UIEvent<HTMLDivElement>
      onScroll(fakeEvent, computePosition(el))
    }
  }, [onScroll, computePosition])

  useEffect(() => {
    return () => {
      debouncedHandleScroll?.cancel()
    }
  }, [debouncedHandleScroll])

  return (
    <div className={cn('cn-scroll-area', className)} dir={direction} onScroll={handleScroll} ref={viewportRef}>
      {children}
    </div>
  )
}

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
