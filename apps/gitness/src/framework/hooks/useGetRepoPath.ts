import { useRouterContext } from '@harnessio/ui/context'

import { PathParams } from '../../RouteDefinitions'
import { useGetSpaceURLParam } from './useGetSpaceParam'

export function useGetRepoRef(): string {
  const spaceURLParam = useGetSpaceURLParam()
  const { useParams } = useRouterContext()
  const { repoId } = useParams<PathParams>()
  return spaceURLParam && repoId ? `${spaceURLParam}/${repoId}/+` : ''
}
