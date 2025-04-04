import { UIMatch, useMatches } from 'react-router-dom'

import { BreadcrumbHandle } from '@harnessio/ui/components'

export const useGetBreadcrumbs = () => {
  const matches = useMatches()
  const breadcrumbs = matches.filter(match => (match.handle as BreadcrumbHandle)?.breadcrumb) as UIMatch<
    unknown,
    BreadcrumbHandle
  >[]
  return { breadcrumbs }
}
