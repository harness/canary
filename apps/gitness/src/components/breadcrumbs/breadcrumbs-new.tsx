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

function BreadcrumbsNew() {
  const matches = useMatches()

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb className="select-none">
          <BreadcrumbList>
            <nav className="flex items-start gap-1">
              <span className="ml-1">Selected Project</span>
              {matches.map((match, index) => {
                /** @ts-expect-error should be of type "CustomHandle". @TODO fix this properly */
                const { breadcrumb } = match.handle || {}
                const isLast = index === matches.length - 1

                if (!breadcrumb) return null

                return (
                  <div key={match.pathname} className="flex items-center">
                    <BreadcrumbSeparator className="mr-1"></BreadcrumbSeparator>
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

export default BreadcrumbsNew
