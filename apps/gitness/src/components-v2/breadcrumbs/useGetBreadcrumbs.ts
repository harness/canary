import { useMemo } from 'react'
import { UIMatch, useMatches } from 'react-router-dom'

import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { CustomHandle } from '../../framework/routing/types'

export const useGetBreadcrumbs = () => {
  const matches = useMatches()

  const { isCurrentSessionPublic } = useMFEContext()
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
