import { useMemo } from 'react'
import { useLocation, useMatches } from 'react-router-dom'

import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { CustomHandle } from '../../framework/routing/types'

export const usePublicAccess = () => {
  const matches = useMatches()
  const location = useLocation()

  const { isPublicAccessEnabledOnResources, isCurrentSessionPublic } = useMFEContext()
  // Check if current route is public
  const isRoutePublic = useMemo(() => {
    // Find the deepest match (most specific route)
    const currentMatch = matches[matches.length - 1]
    const handle = currentMatch?.handle as CustomHandle
    return handle?.publicAccess === true
  }, [matches])

  // Determine if page should be shown as "not public"
  const shouldShowPageNotPublic = useMemo(() => {
    return !isRoutePublic && isCurrentSessionPublic
  }, [isRoutePublic, isCurrentSessionPublic])

  return {
    isCurrentSessionPublic,
    isPublicAccessEnabledOnResources,
    isRoutePublic,
    shouldShowPageNotPublic,
    currentPath: location.pathname
  }
}
