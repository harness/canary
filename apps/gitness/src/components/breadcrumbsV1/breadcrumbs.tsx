import { useMatches } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Topbar
} from '@harnessio/ui/components'

function Breadcrumbs() {
  const matches = useMatches()

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb className="select-none">
          <BreadcrumbList>
            {matches.map((match, index) => {
              /** @ts-expect-error should be of type "CustomHandle". @TODO fix this properly */
              const { breadcrumb } = match.handle || {}
              const isFirst = index === 0
              const isLast = index === matches.length - 1

              if (!breadcrumb) return null

              return (
                <BreadcrumbItem key={index}>
                  {!isFirst ? <BreadcrumbSeparator>/</BreadcrumbSeparator> : null}
                  {isLast ? (
                    breadcrumb(match.params)
                  ) : (
                    <BreadcrumbLink href={match.pathname}>{breadcrumb(match.params)}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </Topbar.Left>
    </Topbar.Root>
  )
}

export default Breadcrumbs
