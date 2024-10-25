import { useParams } from 'react-router-dom'
import { PathParams } from '../../RouteDefinitions'

export function usegetRepoId() {
  const { repoId } = useParams<PathParams>()
  return repoId ?? ''
}
