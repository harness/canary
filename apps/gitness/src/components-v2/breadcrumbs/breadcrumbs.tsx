import { UIMatch } from 'react-router-dom'

import { Breadcrumb, Separator, Sidebar, Topbar } from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

import { CustomHandle } from '../../framework/routing/types'

export interface BreadcrumbsProps {
  breadcrumbs: UIMatch<unknown, CustomHandle>[]
  withMobileSidebarToggle?: boolean
  isMobile?: boolean
  breadcrumbClassName?: string
}

export const Breadcrumbs = ({
  breadcrumbs,
  withMobileSidebarToggle = false,
  isMobile = false,
  breadcrumbClassName
}: BreadcrumbsProps) => {
  const { Link } = useRouterContext()

  if (!breadcrumbs.length) return null

  return (
    <Topbar.Root className={cn('bg-cn-background-0 sticky top-0 z-20', { 'pl-0': !isMobile })}>
      <Topbar.Left>
        {withMobileSidebarToggle && isMobile && (
          <>
            <Sidebar.Trigger className="-ml-1 text-topbar-foreground-2 hover:bg-topbar-background-1 hover:text-topbar-foreground-1" />
            <Separator orientation="vertical" className="ml-1 mr-2 h-4 bg-cn-background-0" />
          </>
        )}
        <Breadcrumb.Root className={breadcrumbClassName}>
          <Breadcrumb.List>
            {breadcrumbs.map((match, index) => {
              const { breadcrumb, asLink = true } = match.handle ?? {}
              const isFirst = index === 0
              const isLast = index === breadcrumbs.length - 1
              const breadcrumbContent = breadcrumb!(match.params)

              return (
                <>
                  {!isFirst && <Breadcrumb.Separator />}
                  {isLast || !asLink ? (
                    <Breadcrumb.Page key={match.pathname}>{breadcrumbContent}</Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Item key={match.pathname}>
                      <Breadcrumb.Link asChild>
                        <Link to={match.pathname}>{breadcrumbContent}</Link>
                      </Breadcrumb.Link>
                    </Breadcrumb.Item>
                  )}
                </>
              )
            })}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Topbar.Left>
    </Topbar.Root>
  )
}
