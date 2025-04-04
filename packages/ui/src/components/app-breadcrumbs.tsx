import { Params, UIMatch } from 'react-router-dom'

import { Breadcrumb, Separator, Sidebar, Topbar, useSidebar } from '@/components'
import { useRouterContext, useTheme } from '@/context'
import { cn } from '@/utils'

export interface BreadcrumbHandle {
  breadcrumb: (params: Params<string>) => string | JSX.Element
  asLink?: boolean
}

export interface AppBreadcrumbsProps {
  breadcrumbs: UIMatch<unknown, BreadcrumbHandle>[]
  withMobileSidebarToggle?: boolean
}

export const AppBreadcrumbs = ({ breadcrumbs, withMobileSidebarToggle = false }: AppBreadcrumbsProps) => {
  const { Link } = useRouterContext()
  const { isMobile } = useSidebar()
  const { isInset } = useTheme()

  if (!breadcrumbs.length) return null

  return (
    <div className={cn('bg-cn-background-1 sticky top-0 z-20', { 'bg-sidebar-background-1': isInset })}>
      <Topbar.Root className={cn({ 'pl-0': isInset && !isMobile })}>
        <Topbar.Left>
          {withMobileSidebarToggle && isMobile && (
            <>
              <Sidebar.Trigger className="text-topbar-foreground-2 hover:bg-topbar-background-1 hover:text-topbar-foreground-1 -ml-1" />
              <Separator orientation="vertical" className="bg-sidebar-background-1 ml-1 mr-2 h-4" />
            </>
          )}
          <Breadcrumb.Root className="select-none">
            <Breadcrumb.List>
              {breadcrumbs.map((match, index) => {
                const { breadcrumb, asLink = true } = match.handle ?? {}
                const isFirst = index === 0
                const isLast = index === breadcrumbs.length - 1
                const breadcrumbContent = breadcrumb!(match.params)

                return (
                  <Breadcrumb.Item key={match.pathname}>
                    {!isFirst && <Breadcrumb.Separator className="text-cn-foreground-disabled" />}
                    {isLast || !asLink ? (
                      <Breadcrumb.Page className={isLast ? 'text-cn-foreground-3' : 'text-cn-foreground-1'}>
                        {breadcrumbContent}
                      </Breadcrumb.Page>
                    ) : (
                      <Breadcrumb.Link className="text-cn-foreground-2 hover:text-cn-foreground-2" asChild>
                        <Link to={match.pathname}>{breadcrumbContent}</Link>
                      </Breadcrumb.Link>
                    )}
                  </Breadcrumb.Item>
                )
              })}
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </Topbar.Left>
      </Topbar.Root>
    </div>
  )
}
