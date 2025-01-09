import { useParams } from 'react-router-dom'

import { PathParams } from '../../RouteDefinitions'
import { useGetSpaceURLParam } from './useGetSpaceParam'

export function useGetRepoRef(): string {
  const spaceURL = useGetSpaceURLParam()
  const { repoId } = useParams<PathParams>()
  return spaceURL && repoId ? `${spaceURL}/${repoId}/+` : ''
}
