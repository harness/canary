import { Link, useMatches } from 'react-router-dom'

import { cn } from '@harnessio/canary'
import { Breadcrumb, Separator, Sidebar, Topbar } from '@harnessio/ui/components'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { CustomHandle } from '../../framework/routing/types'

function Breadcrumbs() {
  const matches = useMatches()
  const matchesWithBreadcrumb = matches.filter(match => (match.handle as CustomHandle)?.breadcrumb)
  const isMFE = useIsMFE()

  return (
    <Topbar.Root>
      <Topbar.Left>
        {!isMFE ? (
          <>
            <Sidebar.Trigger className="text-sidebar-foreground-7 -ml-1" />
            <Separator orientation="vertical" className="bg-sidebar-background-10 ml-1 mr-2 h-4" />
          </>
        ) : null}
        <Breadcrumb.Root className="select-none">
          <Breadcrumb.List>
            {matchesWithBreadcrumb.map((match, index) => {
              const { breadcrumb, asLink = true } = (match.handle || {}) as CustomHandle
              const isFirst = index === 0
              const isLast = index === matchesWithBreadcrumb.length - 1
              const breadcrumbContent = breadcrumb!(match.params)

              return (
                <Breadcrumb.Item key={match.pathname}>
                  {!isFirst && <Breadcrumb.Separator className="text-sidebar-foreground-8" />}
                  {isLast || !asLink ? (
                    <Breadcrumb.Page
                      className={cn('text-sidebar-foreground-8', {
                        'text-sidebar-foreground-9': isLast
                      })}
                    >
                      {breadcrumbContent}
                    </Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Link className="text-sidebar-foreground-8 hover:text-sidebar-foreground-9" asChild>
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
  )
}

export default Breadcrumbs
