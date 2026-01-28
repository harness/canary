import { Navigate, useParams } from 'react-router-dom'

import { FeatureFlag } from '../framework/context/MFEContext'
import { useRoutes } from '../framework/context/NavigationContext'
import { useMFEContext } from '../framework/hooks/useMFEContext'
import { PathParams } from '../RouteDefinitions'

interface FeatureGuardProps {
  featureFlag: FeatureFlag
  children: React.ReactNode
}

export function FeatureGuard({ featureFlag, children }: FeatureGuardProps) {
  const { customHooks } = useMFEContext()
  const routes = useRoutes()
  const { spaceId, repoId } = useParams<PathParams>()

  const featureFlags = customHooks?.useFeatureFlags?.() || {}
  const isEnabled = featureFlags[featureFlag]

  return isEnabled ? <>{children}</> : <Navigate to={routes.toRepoSummary({ spaceId, repoId })} replace />
}

FeatureGuard.displayName = 'FeatureGuard'
