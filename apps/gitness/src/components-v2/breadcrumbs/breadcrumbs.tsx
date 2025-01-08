import { useMatches } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Topbar
} from '@harnessio/ui/components'

import { CustomHandle } from '../../routes'

function Breadcrumbs() {
  const matches = useMatches()

  return (
    <Topbar.Root>
      <Topbar.Left>
        <Breadcrumb className="select-none">
          <BreadcrumbList>
            {matches.map((match, index) => {
              const { breadcrumb } = (match.handle || {}) as CustomHandle
              const isFirst = index === 1
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
