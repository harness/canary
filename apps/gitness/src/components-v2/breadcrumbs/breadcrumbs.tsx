import { Link, useMatches } from 'react-router-dom'

import { Breadcrumb, Separator, Sidebar, Topbar } from '@harnessio/ui/components'
import { useTheme } from '@harnessio/ui/context'

import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { CustomHandle } from '../../framework/routing/types'

function Breadcrumbs() {
  const matches = useMatches()
  const matchesWithBreadcrumb = matches.filter(match => (match.handle as CustomHandle)?.breadcrumb)
  const isMFE = useIsMFE()
  const { isLightTheme } = useTheme()

  return (
    <Topbar.Root>
      <Topbar.Left>
        {!isMFE ? (
          <>
            <Sidebar.Trigger className="text-topbar-foreground-2 hover:text-topbar-foreground-1 hover:bg-topbar-background-1 -ml-1" />
            <Separator orientation="vertical" className="bg-topbar-background-1 ml-1 mr-2 h-4" />
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
                  {!isFirst ? <Breadcrumb.Separator className="text-topbar-foreground-3" /> : null}
                  {isLast || !asLink || isLightTheme ? (
                    <Breadcrumb.Page
                      className={isLast || isLightTheme ? 'text-topbar-foreground-4' : 'text-topbar-foreground-3'}
                    >
                      {breadcrumbContent}
                    </Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Link className="text-topbar-foreground-3" asChild>
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
