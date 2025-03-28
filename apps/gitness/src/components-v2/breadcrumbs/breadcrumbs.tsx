import { Link, useMatches } from 'react-router-dom'

import { Breadcrumb, Topbar } from '@harnessio/ui/components'

import { CustomHandle } from '../../framework/routing/types'

function Breadcrumbs() {
  const matches = useMatches()
  const matchesWithBreadcrumb = matches.filter(match => (match.handle as CustomHandle)?.breadcrumb)

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb.Root className="select-none">
          <Breadcrumb.List>
            {matchesWithBreadcrumb.map((match, index) => {
              const { breadcrumb, asLink = true } = (match.handle || {}) as CustomHandle
              const isFirst = index === 0
              const isLast = index === matchesWithBreadcrumb.length - 1
              const breadcrumbContent = breadcrumb!(match.params)

              return (
                <Breadcrumb.Item key={match.pathname}>
                  {!isFirst && <Breadcrumb.Separator className="text-foreground-9" />}
                  {isLast || !asLink ? (
                    <Breadcrumb.Page className={isLast ? 'text-foreground-3' : 'text-foreground-1'}>
                      {breadcrumbContent}
                    </Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Link className="text-foreground-4 hover:text-foreground-2" asChild>
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
