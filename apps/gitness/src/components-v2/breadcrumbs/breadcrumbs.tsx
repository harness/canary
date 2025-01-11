import { Link, useMatches } from 'react-router-dom'

import { Breadcrumb, Topbar } from '@harnessio/ui/components'

import { CustomHandle } from '../../framework/routing/types'

function Breadcrumbs() {
  const matches = useMatches()

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb.Root className="select-none">
          <Breadcrumb.List>
            <nav className="flex items-start gap-1">
              {matches.map((match, index) => {
                const { breadcrumb } = (match.handle || {}) as CustomHandle
                const isFirst = index === 1
                const isLast = index === matches.length - 1

                if (!breadcrumb) return null

                return (
                  <div key={match.pathname} className="flex items-center">
                    {!isFirst ? <Breadcrumb.Separator className="mr-1" /> : null}
                    <Breadcrumb.Item>
                      <Breadcrumb.Item>
                        {isLast ? (
                          <Breadcrumb.Page>{breadcrumb(match.params)}</Breadcrumb.Page>
                        ) : (
                          <Breadcrumb.Link asChild>
                            <Link to={match.pathname}>{breadcrumb(match.params)}</Link>
                          </Breadcrumb.Link>
                        )}
                      </Breadcrumb.Item>
                    </Breadcrumb.Item>
                  </div>
                )
              })}
            </nav>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Topbar.Left>
    </Topbar.Root>
  )
}

export default Breadcrumbs
