import { forwardRef, HTMLAttributes, ReactNode, RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@utils/cn'

export type IntersectionObserverEntryCallback = (entry: IntersectionObserverEntry) => void

export type ScrollAreaIntersectionProps = {
  onScrollTop?: IntersectionObserverEntryCallback
  onScrollBottom?: IntersectionObserverEntryCallback
  onScrollLeft?: IntersectionObserverEntryCallback
  onScrollRight?: IntersectionObserverEntryCallback

  rootMargin?: { top?: string; right?: string; bottom?: string; left?: string } | string
  threshold?: number | number[]
}

export type ScrollAreaProps = {
  children: ReactNode
  direction?: 'ltr' | 'rtl'
  className?: string
  classNameContent?: string
  preserveScrollPosition?: boolean
  storageKey?: string
} & ScrollAreaIntersectionProps &
  HTMLAttributes<HTMLDivElement>

const MAX_AGE = 30 * 60 * 1000 // 30 minutes
const PERSIST_DEBOUNCE = 1000 // 1s debounce

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      onScrollTop,
      onScrollBottom,
      onScrollLeft,
      onScrollRight,

      rootMargin = '0px',
      threshold = 0.1,

      direction,
      className,
      classNameContent,

      preserveScrollPosition = false,
      storageKey,

      ...rest
    },
    ref
  ) => {
    const viewportRef = useRef<HTMLDivElement | null>(null)
    const scrollTimeoutRef = useRef<NodeJS.Timeout>()

    const topMarkerRef = useRef<HTMLDivElement | null>(null)
    const bottomMarkerRef = useRef<HTMLDivElement | null>(null)
    const leftMarkerRef = useRef<HTMLDivElement | null>(null)
    const rightMarkerRef = useRef<HTMLDivElement | null>(null)

    // Save scroll position to sessionStorage
    const saveScrollPosition = useCallback(() => {
      if (!preserveScrollPosition || !storageKey || !viewportRef.current) return

      const scrollTop = viewportRef.current.scrollTop

      try {
        sessionStorage.setItem(`scroll_${storageKey}`, JSON.stringify({ scrollTop, timestamp: Date.now() }))
      } catch (error) {
        // Fail silently
        console.warn('Failed to save scroll position:', error)
      }
    }, [preserveScrollPosition, storageKey])

    // Restore scroll position from sessionStorage
    const restoreScrollPosition = useCallback(() => {
      if (!preserveScrollPosition || !storageKey || !viewportRef.current) return

      try {
        const stored = sessionStorage.getItem(`scroll_${storageKey}`)
        if (stored) {
          const { scrollTop, timestamp } = JSON.parse(stored)

          if (Date.now() - timestamp < MAX_AGE) {
            viewportRef.current.scrollTop = scrollTop
          } else {
            sessionStorage.removeItem(`scroll_${storageKey}`)
          }
        }
      } catch (error) {
        // Fail silently
        console.warn('Failed to restore scroll position:', error)
      }
    }, [preserveScrollPosition, storageKey])

    // Handle scroll events with debouncing
    const handleScroll = useCallback(() => {
      if (!preserveScrollPosition) return
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        saveScrollPosition()
      }, PERSIST_DEBOUNCE)
    }, [preserveScrollPosition, saveScrollPosition])

    // scroll position clean up
    useEffect(() => {
      if (!preserveScrollPosition || !storageKey) return
      try {
        const keysToRemove: string[] = []
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key?.startsWith('scroll_') && key !== `scroll_${storageKey}`) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key))
      } catch (error) {
        // Fail silently
      }
    }, [preserveScrollPosition, storageKey])

    // Restore scroll position on mount
    useEffect(() => {
      if (!preserveScrollPosition || !storageKey) return
      const timer = setTimeout(() => {
        restoreScrollPosition()
      }, 0)
      return () => clearTimeout(timer)
    }, [preserveScrollPosition, restoreScrollPosition, storageKey])

    useEffect(() => {
      const viewport = viewportRef.current
      if (!viewport) return

      viewport.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        viewport.removeEventListener('scroll', handleScroll)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }
    }, [handleScroll])

    const createObserver = useCallback(
      (
        markerRef: RefObject<HTMLElement>,
        callback?: (entry: IntersectionObserverEntry) => void
      ): IntersectionObserver | null => {
        if (!markerRef.current || !callback) return null

        if (typeof rootMargin === 'object') {
          const { top, right, bottom, left } = rootMargin
          rootMargin = `${top || '0px'} ${right || '0px'} ${bottom || '0px'} ${left || '0px'}`
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            callback(entry)
          },
          {
            root: viewportRef.current,
            rootMargin,
            threshold
          }
        )

        observer.observe(markerRef.current)
        return observer
      },
      [rootMargin, threshold]
    )

    useEffect(() => {
      const observers: IntersectionObserver[] = []

      const configs: [RefObject<HTMLElement>, IntersectionObserverEntryCallback | undefined][] = [
        [topMarkerRef, onScrollTop],
        [bottomMarkerRef, onScrollBottom],
        [leftMarkerRef, onScrollLeft],
        [rightMarkerRef, onScrollRight]
      ]

      for (const [ref, cb] of configs) {
        const obs = createObserver(ref, cb)
        if (obs) observers.push(obs)
      }

      return () => {
        observers.forEach(o => o.disconnect())
      }
    }, [createObserver, onScrollTop, onScrollBottom, onScrollLeft, onScrollRight])

    return (
      <div className={cn('cn-scroll-area', className)} dir={direction} ref={viewportRef}>
        <div className={cn('cn-scroll-area-content', classNameContent)} ref={ref} {...rest}>
          {children}

          {onScrollTop && <div className="cn-scroll-area-marker cn-scroll-area-marker-top" ref={topMarkerRef} />}
          {onScrollBottom && (
            <div className="cn-scroll-area-marker cn-scroll-area-marker-bottom" ref={bottomMarkerRef} />
          )}
          {onScrollLeft && <div className="cn-scroll-area-marker cn-scroll-area-marker-left" ref={leftMarkerRef} />}
          {onScrollRight && <div className="cn-scroll-area-marker cn-scroll-area-marker-right" ref={rightMarkerRef} />}
        </div>
      </div>
    )
  }
)

ScrollArea.displayName = 'ScrollArea'

const useScrollArea = (props?: ScrollAreaProps) => {
  const [isTop, setIsTop] = useState(true)
  const [isBottom, setIsBottom] = useState(false)

  const onScrollTop = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && !isTop) {
        setIsTop(true)
      }

      if (!entry.isIntersecting) {
        setIsTop(false)
      }

      if (props?.onScrollTop) {
        props.onScrollTop(entry)
      }
    },
    [isTop, props]
  )

  const onScrollBottom = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && !isBottom) {
        setIsBottom(true)
      }

      if (!entry.isIntersecting) {
        setIsBottom(false)
      }

      if (props?.onScrollBottom) {
        props.onScrollBottom(entry)
      }
    },
    [isBottom, props]
  )

  // add onScrollLeft and onScrollRight if needed

  return {
    isTop,
    isBottom,
    onScrollTop,
    onScrollBottom
  }
}

export { ScrollArea, useScrollArea }
