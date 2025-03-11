import { useParams } from 'react-router-dom'

import type { PathParams } from '../../RouteDefinitions'
import { useIsMFE } from './useIsMFE'
import { useMFEContext } from './useMFEContext'

export function useGetPathParams(): Partial<PathParams> {
  const params = useParams<PathParams>()

  const isMFE = useIsMFE()
  const mfeParams: PathParams = useMFEContext()?.customHooks?.useParams()

  return isMFE ? mfeParams : params
}
