import { Link, UIMatch } from 'react-router-dom'

import { Breadcrumb, Separator, Sidebar, Topbar } from '@harnessio/ui/components'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { CustomHandle } from '../../framework/routing/types'

// import { routes } from '../../v6/RouteDestinations'

function Breadcrumbs() {
  const matches: UIMatch[] = useMFEContext()?.customHooks?.useMatches?.([])
  const matchesWithBreadcrumb = matches.filter(match => (match.handle as CustomHandle)?.breadcrumb)
  const isMFE = useIsMFE()

  return (
    <Topbar.Root>
      <Topbar.Left>
        {!isMFE ? (
          <>
            <Sidebar.Trigger className="-ml-1" />
            <Separator orientation="vertical" className="ml-1 mr-2 h-4" />
          </>
        ) : null}
        <Breadcrumb.Root className="select-none">
          <Breadcrumb.List>
            {matchesWithBreadcrumb.length > 0 ? (
              matchesWithBreadcrumb.map((match, index) => {
                const { breadcrumb, asLink = true } = (match.handle || {}) as CustomHandle
                const isFirst = index === 0
                const isLast = index === matchesWithBreadcrumb.length - 1
                const breadcrumbContent = breadcrumb!(match.params)

                return (
                  <Breadcrumb.Item key={match.pathname}>
                    {!isFirst ? <Breadcrumb.Separator /> : null}
                    {isLast || !asLink ? (
                      <Breadcrumb.Page className={isLast ? 'text-foreground' : 'text-muted-foreground'}>
                        {breadcrumbContent}
                      </Breadcrumb.Page>
                    ) : (
                      <Breadcrumb.Link asChild>
                        <Link to={match.pathname}>{breadcrumbContent}</Link>
                      </Breadcrumb.Link>
                    )}
                  </Breadcrumb.Item>
                )
              })
            ) : (
              <Breadcrumb.Item>Breadcrumbs Location</Breadcrumb.Item>
            )}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Topbar.Left>
    </Topbar.Root>
  )
}

export default Breadcrumbs
