import { useRouterContext } from '@harnessio/ui/context'

import { PathParams } from '../../RouteDefinitions'
import { useGetSpaceURLParam } from './useGetSpaceParam'

export function useGetRepoRef(): string {
  const spaceURL = useGetSpaceURLParam()
  const { useParams } = useRouterContext()
  const { repoId } = useParams<PathParams>()
  return spaceURL && repoId ? `${spaceURL}/${repoId}/+` : ''
}
