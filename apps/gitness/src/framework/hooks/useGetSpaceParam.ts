import { useParams } from 'react-router-dom'

import type { PathParams } from '../../RouteDefinitions'
import { useIsMFE } from './useIsMFE'
import { useMFEContext } from './useMFEContext'

export function useGetSpaceURLParam(): string | undefined {
  const { spaceId } = useParams<PathParams>()

  const isMFE = useIsMFE()
  const {
    scope: { accountId, orgIdentifier, projectIdentifier }
  } = useMFEContext()

  return !isMFE ? spaceId : [accountId, orgIdentifier, projectIdentifier].filter(Boolean).join('/')
}
