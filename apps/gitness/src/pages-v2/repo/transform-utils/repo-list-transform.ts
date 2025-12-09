import { RepoRepositoryOutput } from '@harnessio/code-service-client'
import { RepositoryType } from '@harnessio/ui/views'

export const transformRepoList = (repoList: RepoRepositoryOutput[]): RepositoryType[] => {
  return repoList.map(repo => ({
    id: repo.id || 0,
    name: repo.identifier || '',
    description: repo.description || '',
    private: !repo.is_public,
    archived: repo.archived,
    stars: 0,
    forks: repo.num_forks || 0,
    default_branch: repo.default_branch || '',
    pulls: repo.num_pulls || 0,
    timestamp: repo.updated ? new Date(repo.updated).toISOString() : '',
    createdAt: repo.created || 0,
    importing: !!repo.importing,
    favorite: repo.is_favorite,
    path: repo.path || ''
  }))
}
