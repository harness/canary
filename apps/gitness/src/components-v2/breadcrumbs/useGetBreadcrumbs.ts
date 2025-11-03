import { useMemo } from 'react'
import { UIMatch, useMatches } from 'react-router-dom'

import { useAppContext } from '../../framework/context/AppContext'
import { CustomHandle } from '../../framework/routing/types'

export const useGetBreadcrumbs = () => {
  const matches = useMatches()
  const { isCurrentSessionPublic } = useAppContext()

  // Filter breadcrumbs based on public session
  const breadcrumbs = useMemo(() => {
    const allBreadcrumbs = matches.filter(match => (match.handle as CustomHandle)?.breadcrumb) as UIMatch<
      unknown,
      CustomHandle
    >[]

    if (!isCurrentSessionPublic) {
      // If not in public session, show all breadcrumbs
      return allBreadcrumbs
    }

    // In public session, hide all breadcrumbs as per user requirement
    return []
  }, [matches, isCurrentSessionPublic])

  return {
    breadcrumbs,
    isPublicSession: isCurrentSessionPublic
  }
}
