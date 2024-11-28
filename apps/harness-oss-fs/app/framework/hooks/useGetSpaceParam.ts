import { useParams } from 'react-router'

import { PathParams } from '~/RouteDefinitions'

export function useGetSpaceURLParam(): string | undefined {
  const { spaceId } = useParams<PathParams>()
  return spaceId
}
