import { RepoRepositoryOutput } from '@harnessio/code-service-client'
import { RepositoryType } from '@harnessio/ui/views'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'

export const transformRepoList = (repoList: RepoRepositoryOutput[]): RepositoryType[] => {
  return repoList.map(repo => ({
    id: repo.id || 0,
    name: repo.identifier || '',
    description: repo.description || '',
    private: !repo.is_public,
    stars: 0,
    forks: repo.num_forks || 0,
    pulls: repo.num_pulls || 0,
    timestamp: repo.updated ? timeAgoFromEpochTime(repo.updated) : '',
    createdAt: repo.created || 0,
    importing: !!repo.importing
  }))
}
