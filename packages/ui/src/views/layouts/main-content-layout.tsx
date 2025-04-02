import { PropsWithChildren, ReactNode } from 'react'

import { useTheme } from '@/context'
import { cn } from '@/utils'

const HalfArch = ({ className }: { className?: string }) => (
  <div className="relative size-1.5 overflow-hidden">
    <div
      className={cn(
        'absolute top-0 size-3 rounded-full border shadow-[0_0_0_20px_hsl(var(--canary-sidebar-background-01))]',
        className
      )}
    />
  </div>
)

interface MainContentLayoutProps extends PropsWithChildren<unknown> {
  breadcrumbs?: ReactNode
}

export function MainContentLayout({ children, breadcrumbs }: MainContentLayoutProps) {
  const { isInset } = useTheme()
  const withBreadcrumbs = !!breadcrumbs

  return (
    <>
      {withBreadcrumbs && (
        <div className={cn('bg-cn-background-1 sticky top-0 z-20', { 'bg-sidebar-background-1': isInset })}>
          {breadcrumbs}
        </div>
      )}
      <div
        className={cn(
          'min-h-screen bg-cds-background-1',
          { 'min-h-[calc(100vh-55px)]': withBreadcrumbs },
          { 'min-h-[calc(100vh-6px*2)] my-1.5 mr-1.5 border rounded-md min-w-fit': isInset },
          { 'min-h-[calc(100vh-55px-6px)] mb-1.5 mt-0': isInset && withBreadcrumbs }
        )}
      >
        {isInset && (
          <div
            aria-hidden
            role="presentation"
            className={cn(
              'sticky w-[calc(100%+2px)] flex justify-between left-0 right-0 top-0 -mx-px -mt-px -mb-1.5 z-20',
              { 'top-[55px]': withBreadcrumbs }
            )}
          >
            <HalfArch className="left-0" />
            <div className="w-full border-t" />
            <HalfArch className="right-0" />
          </div>
        )}
        {children}
      </div>
    </>
  )
}
