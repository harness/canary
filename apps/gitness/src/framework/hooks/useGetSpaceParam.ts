import { useParams } from 'react-router-dom'

import type { PathParams } from '../../RouteDefinitions'
import { useMFEContext } from './useMFEContext'

export function useGetSpaceURLParam(): string | undefined {
  const { spaceId } = useParams<PathParams>()
  const {
    scope: { accountId, orgIdentifier, projectIdentifier }
  } = useMFEContext()

  return spaceId || [accountId, orgIdentifier, projectIdentifier].filter(Boolean).join('/')
}
