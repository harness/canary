import { Link, useMatches } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Topbar
} from '@harnessio/ui/components'

import { CustomHandle } from '../../framework/routing/types'

function Breadcrumbs() {
  const matches = useMatches()

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb className="select-none">
          <BreadcrumbList>
            <nav className="flex items-start gap-1">
              {matches.map((match, index) => {
                const { breadcrumb } = (match.handle || {}) as CustomHandle
                const isFirst = index === 1
                const isLast = index === matches.length - 1

                if (!breadcrumb) return null

                return (
                  <div key={match.pathname} className="flex items-center">
                    {!isFirst ? <BreadcrumbSeparator className="mr-1" /> : null}
                    <BreadcrumbItem>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{breadcrumb(match.params)}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={match.pathname}>{breadcrumb(match.params)}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </BreadcrumbItem>
                  </div>
                )
              })}
            </nav>
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar.Left>
    </Topbar.Root>
  )
}

export default Breadcrumbs
