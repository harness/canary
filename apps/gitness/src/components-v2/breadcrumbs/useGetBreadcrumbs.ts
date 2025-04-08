import { UIMatch, useMatches } from 'react-router-dom'

import { CustomHandle } from '../../framework/routing/types'

export const useGetBreadcrumbs = () => {
  const matches = useMatches()
  const breadcrumbs = matches.filter(match => (match.handle as CustomHandle)?.breadcrumb) as UIMatch<
    unknown,
    CustomHandle
  >[]
  return { breadcrumbs }
}
