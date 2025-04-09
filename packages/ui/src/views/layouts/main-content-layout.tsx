import { PropsWithChildren } from 'react'

import { SidebarContext } from '@/components'
import { useTheme } from '@/context'
import { cn } from '@/utils'

/**
 * The component `HalfArch` creates a visual layer that is used to keep the top corners
 * of the main content rounded when a page is scrolled to the top.
 */
const HalfArch = ({ className }: { className?: string }) => (
  <div className="relative size-[var(--cn-inset-layout-indent)] overflow-hidden">
    <div
      className={cn(
        'absolute top-0 size-[calc(var(--cn-inset-layout-indent)*2)] rounded-full border shadow-[0_0_0_20px_hsl(var(--canary-sidebar-background-01))]',
        className
      )}
    />
  </div>
)

type MainContentLayoutProps = PropsWithChildren<{
  useSidebar?: () => SidebarContext
  withBreadcrumbs?: boolean
  className?: string
}>

export function MainContentLayout({ children, useSidebar, className, withBreadcrumbs }: MainContentLayoutProps) {
  const { isInset } = useTheme()
  const sidebarData = useSidebar?.()
  const isMobile = sidebarData?.isMobile

  return (
    <div
      className={cn(
        'min-h-screen bg-cn-background-1',
        {
          'ml-[var(--cn-inset-layout-indent)]': isMobile,
          'min-h-[calc(100vh-var(--cn-breadcrumbs-height))]': withBreadcrumbs,
          'min-h-[calc(100vh-var(--cn-inset-layout-indent)*2)] my-[var(--cn-inset-layout-indent)] mr-[var(--cn-inset-layout-indent)] border rounded-md min-w-fit':
            isInset,
          'min-h-[calc(100vh-var(--cn-breadcrumbs-height)-var(--cn-inset-layout-indent))] mb-[var(--cn-inset-layout-indent)] mt-0':
            isInset && withBreadcrumbs
        },
        className
      )}
    >
      {isInset && (
        <div
          aria-hidden
          role="presentation"
          className={cn(
            'sticky w-[calc(100%+2px)] flex justify-between left-0 right-0 top-0 -mx-px -mt-px -mb-[var(--cn-inset-layout-indent)] z-20',
            { 'top-[var(--cn-breadcrumbs-height)]': withBreadcrumbs }
          )}
        >
          <HalfArch className="left-0" />
          <div className="w-full border-t" />
          <HalfArch className="right-0" />
        </div>
      )}
      {children}
    </div>
  )
}
