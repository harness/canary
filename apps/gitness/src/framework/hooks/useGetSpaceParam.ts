import { useParams } from 'react-router-dom'

import type { PathParams } from '../../RouteDefinitions'

export function useGetSpaceURLParam(): string | undefined {
  const { spaceId } = useParams<PathParams>()
  return spaceId
}
