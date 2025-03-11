import { useParams } from 'react-router-dom'

import type { PathParams } from '../../RouteDefinitions'
import { useIsMFE } from './useIsMFE'
import { useMFEContext } from './useMFEContext'

export function useGetRepoPathParam(): string | undefined {
  const { repoId } = useParams<PathParams>()

  const isMFE = useIsMFE()
  const params: PathParams = useMFEContext()?.customHooks?.useParams()

  return isMFE ? params.repoId : repoId
}
