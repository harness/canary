import { useParams } from 'react-router-dom'
import { PathParams } from '../../RouteDefinitions'
import { useGetSpaceURLParam } from './useGetSpaceParam'

export function useGetRepoRef(): string {
  const space = useGetSpaceURLParam()
  const { repoId } = useParams<PathParams>()
  return space && repoId ? `${space}/${repoId}/+` : ''
}
