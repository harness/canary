import { forwardRef } from 'react'

import { ScrollArea, ScrollAreaProps, useScrollArea } from '@/components'
import { cn } from '@/utils'

export const DrawerBody = forwardRef<
  HTMLDivElement,
  ScrollAreaProps & { scrollAreaClassName?: string; scrollable?: boolean }
>((props, ref) => {
  const { isTop, isBottom, onScrollTop, onScrollBottom } = useScrollArea(props)
  const { className, children, scrollAreaClassName, classNameContent, scrollable = true, ...restProps } = props

  return (
    <div
      className={cn(
        'cn-drawer-body-wrap',
        { 'cn-drawer-body-wrap-top': isTop, 'cn-drawer-body-wrap-bottom': isBottom },
        className
      )}
    >
      {scrollable === true ? (
        <ScrollArea
          ref={ref}
          {...restProps}
          onScrollTop={onScrollTop}
          onScrollBottom={onScrollBottom}
          className={cn('cn-drawer-body', scrollAreaClassName)}
          classNameContent={cn('cn-drawer-body-content', classNameContent)}
        >
          {children}
        </ScrollArea>
      ) : (
        <div className={cn('cn-drawer-body', scrollAreaClassName)} ref={ref} {...restProps}>
          <div className={cn('cn-drawer-body-content', classNameContent)}>{children}</div>
        </div>
      )}
    </div>
  )
})
DrawerBody.displayName = 'DrawerBody'
