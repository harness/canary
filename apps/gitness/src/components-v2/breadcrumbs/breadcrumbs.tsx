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
            {matches.map((match, index) => {
              const { breadcrumb, asLink = true } = (match.handle || {}) as CustomHandle
              if (!breadcrumb) return null

              const isFirst = index === 1
              const isLast = index === matches.length - 1
              const breadcrumbContent = breadcrumb(match.params)

              return (
                <Breadcrumb.Item key={match.pathname}>
                  {!isFirst ? <Breadcrumb.Separator /> : null}
                  {isLast || !asLink ? (
                    <Breadcrumb.Page>{breadcrumbContent}</Breadcrumb.Page>
                  ) : (
                    <Breadcrumb.Link asChild>
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
