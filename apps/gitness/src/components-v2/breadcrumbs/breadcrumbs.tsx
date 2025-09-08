import { UIMatch } from 'react-router-dom'

import { Breadcrumb, IconV2, Separator, Sidebar, Topbar } from '@harnessio/ui/components'
import { useRouterContext } from '@harnessio/ui/context'

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
    <Topbar.Root className="bg-cn-1 sticky left-0 top-0 z-20 border-b">
      <Topbar.Left>
        {withMobileSidebarToggle && isMobile && (
          <>
            <Sidebar.Trigger className="-ml-1" />
            <Separator orientation="vertical" className="bg-cn-0 ml-1 mr-2 h-4" />
          </>
        )}
        <Breadcrumb.Root className={breadcrumbClassName} size="sm" separator={<IconV2 name="nav-arrow-right" />}>
          <Breadcrumb.List>
            {breadcrumbs.map((match, index) => {
              const { breadcrumb, asLink = true } = match.handle ?? {}
              const isFirst = index === 0
              const isLast = index === breadcrumbs.length - 1
              const breadcrumbContent = breadcrumb!(match.params)

              return (
                <>
                  {!isFirst && (
                    <Breadcrumb.Separator>
                      <IconV2 name="nav-arrow-right" className="text-cn-brand" size="2xs" />
                    </Breadcrumb.Separator>
                  )}
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
