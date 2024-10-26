import { useParams } from 'react-router-dom'
import { PathParams } from '../../RouteDefinitions'

export function useGetRepoId() {
  const { repoId } = useParams<PathParams>()
  return repoId ?? ''
}
