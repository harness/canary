import { PropsWithChildren, useCallback, useState } from 'react'

import { ScrollArea, ScrollAreaProps } from '@/components'
import { cn } from '@/utils'

export const DrawerBody = ({
  children,
  className,
  scrollAreaProps
}: PropsWithChildren<{ className?: string; scrollAreaProps?: ScrollAreaProps }>) => {
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

      if (scrollAreaProps?.onScrollTop) {
        scrollAreaProps.onScrollTop(entry)
      }
    },
    [isTop, scrollAreaProps]
  )

  const onScrollBottom = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && !isBottom) {
        setIsBottom(true)
      }

      if (!entry.isIntersecting) {
        setIsBottom(false)
      }

      if (scrollAreaProps?.onScrollBottom) {
        scrollAreaProps.onScrollBottom(entry)
      }
    },
    [isBottom, scrollAreaProps]
  )

  return (
    <div
      className={cn(
        'cn-drawer-body-wrap',
        {
          'cn-drawer-body-wrap-top': isTop,
          'cn-drawer-body-wrap-bottom': isBottom
        },
        className
      )}
    >
      <ScrollArea
        {...scrollAreaProps}
        onScrollTop={onScrollTop}
        onScrollBottom={onScrollBottom}
        className={cn('cn-drawer-body', scrollAreaProps?.className)}
        classNameContent={cn('cn-drawer-body-content', scrollAreaProps?.classNameContent)}
      >
        {children}
      </ScrollArea>
    </div>
  )
}
DrawerBody.displayName = 'DrawerBody'
