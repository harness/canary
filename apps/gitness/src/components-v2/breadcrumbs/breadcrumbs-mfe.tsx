import { Link, useMatches } from 'react-router-dom'

import { Breadcrumb, Separator, Sidebar, Topbar } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

import { useThemeStore } from '../../framework/context/ThemeContext'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { CustomHandle } from '../../framework/routing/types'

function BreadcrumbsMFE() {
  const matches = useMatches()
  const matchesWithBreadcrumb = matches.filter(match => (match.handle as CustomHandle)?.breadcrumb)
  const isMFE = useIsMFE()
  const { isInset } = useThemeStore()

  return (
    <Topbar.Root className={cn({ 'pl-0': isInset })}>
      <Topbar.Left>
        {!isMFE && (
          <>
            <Sidebar.Trigger className="-ml-1 text-topbar-foreground-2 hover:bg-topbar-background-1 hover:text-topbar-foreground-1" />
            <Separator orientation="vertical" className="ml-1 mr-2 h-4 bg-sidebar-background-1" />
          </>
        )}
        <Breadcrumb.Root className="select-none">
          <Breadcrumb.List>
            {matchesWithBreadcrumb.map((match, index) => {
              const { breadcrumb, asLink = true } = (match.handle || {}) as CustomHandle
              const isFirst = index === 0
              const isLast = index === matchesWithBreadcrumb.length - 1
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
  )
}

export default BreadcrumbsMFE
