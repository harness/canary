import { useMatches } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@harnessio/ui/components'

function Breadcrumbs() {
  const matches = useMatches()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {/**
           * Fixed/Default links
           */}
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {matches.map((match, index) => {
          /** @ts-expect-error should be of type "CustomHandle". @TODO fix this properly */
          const { breadcrumb } = match.handle || {}
          const isLast = index === matches.length - 1

          if (!breadcrumb) return null

          return (
            <BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
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
  )
}

export default Breadcrumbs
