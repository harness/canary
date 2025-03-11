import { useGetRepoPathParam } from './useGetRepoPathParam'
import { useGetSpaceURLParam } from './useGetSpaceParam'

export function useGetRepoRef(): string {
  const spaceURL = useGetSpaceURLParam()
  // const { repoId } = useParams<PathParams>() // useParams doesn't work now, need to use from MFE context
  const repoId = useGetRepoPathParam()
  return spaceURL && repoId ? `${spaceURL}/${repoId}/+` : ''
}
