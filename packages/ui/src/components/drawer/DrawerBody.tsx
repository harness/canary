import { ScrollArea, ScrollAreaProps, useScrollArea } from '@/components'
import { cn } from '@/utils'

export const DrawerBody = (props: ScrollAreaProps & { scrollAreaClassName?: string }) => {
  const { isTop, isBottom, onScrollTop, onScrollBottom } = useScrollArea(props)
  const { className, children, scrollAreaClassName, classNameContent, ...restProps } = props

  return (
    <div
      className={cn(
        'cn-drawer-body-wrap',
        { 'cn-drawer-body-wrap-top': isTop, 'cn-drawer-body-wrap-bottom': isBottom },
        className
      )}
    >
      <ScrollArea
        {...restProps}
        onScrollTop={onScrollTop}
        onScrollBottom={onScrollBottom}
        className={cn('cn-drawer-body', scrollAreaClassName)}
        classNameContent={cn('cn-drawer-body-content', classNameContent)}
      >
        {children}
      </ScrollArea>
    </div>
  )
}
DrawerBody.displayName = 'DrawerBody'
