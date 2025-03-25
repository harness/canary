import { CSSProperties, PropsWithChildren, ReactNode } from 'react'

import { useTheme } from '@/context'
import { cn, wrapConditionalObjectElement } from '@/utils'
import { ScrollArea, ScrollAreaProps } from '@components/scroll-area'

interface MainContentLayoutProps extends PropsWithChildren<unknown> {
  className?: string
  breadcrumbs?: ReactNode
}

export function MainContentLayout({ className, children, breadcrumbs }: MainContentLayoutProps) {
  const { isInset } = useTheme()

  return (
    <div className={cn('h-screen', className)}>
      {!!breadcrumbs && (
        <div className={cn('layer-high bg-background-1 sticky top-0', { 'bg-sidebar-background-1': isInset })}>
          {breadcrumbs}
        </div>
      )}
      <div
        className={cn('main-content-height', {
          'overflow-hidden mx-1.5 z- bg-sidebar-background-1 rounded-t-md': isInset
        })}
      >
        <ScrollArea
          type="always"
          orientation="both"
          className="h-full"
          viewportClassName={cn('!overflow-scroll min-h-full [&>div]:!grid [&>div]:min-h-full', {
            'min-h-[calc(100%-6px)]': isInset
          })}
          scrollBarProps={{ vertical: { className: 'z-20' } }}
          {...wrapConditionalObjectElement<ScrollAreaProps>(
            {
              scrollBarProps: { vertical: { className: 'h-auto z-20' }, horizontal: { className: '!bottom-1.5 z-20' } },
              style: {
                '--radix-scroll-area-corner-height': '6px',
                '--radix-scroll-area-corner-width': '14px'
              } as CSSProperties
            },
            isInset
          )}
        >
          <div className={cn({ 'rounded-b-md mb-1.5 bg-background-1 min-w-fit': isInset })}>{children}</div>
        </ScrollArea>
      </div>
    </div>
  )
}
