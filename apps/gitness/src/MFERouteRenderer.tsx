import { useEffect, useMemo } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router-dom'

import { useMFEContext } from './framework/hooks/useMFEContext'
import { extractRedirectRouteObjects } from './framework/routing/utils'
import { repoRoutes } from './routes'
import { decodeURIComponentIfValid } from './utils/path-utils'

export const MFERouteRenderer: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { renderUrl, parentLocationPath, onRouteChange } = useMFEContext()
  const parentPath = parentLocationPath.replace(renderUrl, '')

  const filteredRedirectRoutes = extractRedirectRouteObjects(repoRoutes)

  const isRouteNotMatchingRedirectRoutes = (pathToValidate: string) => {
    return filteredRedirectRoutes.every(route => !matchPath(`/${route.path}` as string, pathToValidate))
  }

  const isNotRedirectPath = isRouteNotMatchingRedirectRoutes(location.pathname)

  /**
   * renderUrl ==> base URL of parent application
   * parentPath ==> path name of parent application after base URL
   * location.pathname ==> path name of MFE
   * isNotRedirectPath ==> check if the current path is not a redirect path
   */
  const canNavigate = useMemo(
    () =>
      renderUrl &&
      decodeURIComponentIfValid(parentPath) !== decodeURIComponentIfValid(location.pathname) &&
      isNotRedirectPath,
    [isNotRedirectPath, location.pathname, parentPath, renderUrl]
  )

  // Handle location change detected from parent route
  useEffect(() => {
    if (canNavigate) {
      navigate(decodeURIComponentIfValid(parentPath), { replace: true })
    }
  }, [parentPath])

  // Notify parent about route change
  useEffect(() => {
    if (canNavigate) {
      onRouteChange?.(decodeURIComponentIfValid(`${renderUrl}${location.pathname}${location.search}`))
    }
  }, [location.pathname])

  return null
}
