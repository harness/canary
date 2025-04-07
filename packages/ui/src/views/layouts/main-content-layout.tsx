import { PropsWithChildren } from 'react'

import { SidebarContext } from '@/components'
import { useTheme } from '@/context'
import { cn } from '@/utils'
import { AppBreadcrumbs, AppBreadcrumbsProps } from '@components/app-breadcrumbs'

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

type MainContentLayoutProps = PropsWithChildren<AppBreadcrumbsProps & { useSidebar?: () => SidebarContext }>

export function MainContentLayout({ children, useSidebar, ...breadcrumbsProps }: MainContentLayoutProps) {
  const { isInset } = useTheme()
  const sidebarData = useSidebar?.()
  const isMobile = sidebarData?.isMobile
  const withBreadcrumbs = breadcrumbsProps.breadcrumbs?.length > 0

  return (
    <>
      <AppBreadcrumbs isMobile={isMobile} {...breadcrumbsProps} />
      <div
        className={cn(
          'min-h-screen bg-cn-background-1',
          { 'min-h-[calc(100vh-55px)]': withBreadcrumbs },
          { 'min-h-[calc(100vh-6px*2)] my-1.5 mr-1.5 border rounded-md min-w-fit': isInset },
          { 'min-h-[calc(100vh-55px-6px)] mb-1.5 mt-0': isInset && withBreadcrumbs },
          { 'ml-1.5': isMobile }
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
