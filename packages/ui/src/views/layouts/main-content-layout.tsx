import { PropsWithChildren } from 'react'

import { SidebarContext } from '@/components'
import { useTheme } from '@/context'
import { cn } from '@/utils'

/**
 * The component `HalfArch` creates a visual layer that is used to keep the top corners
 * of the main content rounded when a page is scrolled to the top.
 */
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
          'ml-1.5': isMobile,
          'min-h-[calc(100vh-55px)]': withBreadcrumbs,
          'min-h-[calc(100vh-55px-6px)] mb-1.5 mt-0': isInset && withBreadcrumbs,
          'min-h-[calc(100vh-6px*2)] my-1.5 mr-1.5 border rounded-md min-w-fit': isInset
        },
        className
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
  )
}
