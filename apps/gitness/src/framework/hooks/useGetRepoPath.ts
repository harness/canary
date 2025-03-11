import { PathParams } from '../../RouteDefinitions'
import { useGetPathParams } from './useGetPathParams'
import { useGetSpaceURLParam } from './useGetSpaceParam'

export function useGetRepoRef(): string {
  const spaceURL = useGetSpaceURLParam()
  // const { repoId } = useParams<PathParams>() // useParams doesn't work now, need to use from MFE context
  const { repoId } = useGetPathParams<PathParams>()
  return spaceURL && repoId ? `${spaceURL}/${repoId}/+` : ''
}
