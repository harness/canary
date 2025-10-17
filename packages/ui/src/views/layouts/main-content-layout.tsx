import { PropsWithChildren } from 'react'

import { Layout, UseSidebarSignature } from '@/components'
import { cn } from '@/utils'

/**
 * The component `HalfArch` creates a visual layer that is used to keep the top corners
 * of the main content rounded when a page is scrolled to the top.
 */
const HalfArch = ({ className }: { className?: string }) => (
  <div className="relative size-[var(--cn-inset-layout-indent)] overflow-hidden">
    <div
      className={cn(
        'absolute top-0 size-[calc(var(--cn-inset-layout-indent)*2)] rounded-full border shadow-[0_0_0_20px_var(--cn-bg-0)]',
        className
      )}
    />
  </div>
)

type MainContentLayoutProps = PropsWithChildren<{
  useSidebar?: UseSidebarSignature
  withBreadcrumbs?: boolean
  className?: string
  enableInset?: boolean
}>

export function MainContentLayout({
  children,
  useSidebar,
  className,
  withBreadcrumbs,
  enableInset = false
}: MainContentLayoutProps) {
  const sidebarData = useSidebar?.()
  const isMobile = sidebarData?.isMobile

  return (
    <Layout.Flex
      id="main-content-layout"
      direction="column"
      className={cn(
        'min-h-[calc(100vh-var(--cn-inset-layout-indent)*2)] mx-[var(--cn-inset-layout-indent)] my-[var(--cn-inset-layout-indent)] border-[var(--cn-inset-border-width)] bg-cn-1',
        {
          'rounded-3': isMobile || enableInset,
          'min-h-[calc(100vh-var(--cn-breadcrumbs-height)-var(--cn-inset-layout-indent))] mb-[var(--cn-inset-layout-indent)] mt-0':
            withBreadcrumbs
        },
        className
      )}
      style={
        {
          '--cn-inset-layout-indent': enableInset ? '6px' : '0px',
          '--cn-inset-border-width': enableInset ? '1px' : '0px'
        } as React.CSSProperties
      }
    >
      {enableInset && (
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
    </Layout.Flex>
  )
}
