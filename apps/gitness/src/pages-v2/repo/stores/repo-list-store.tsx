import { create } from 'zustand'

import { ListReposOkResponse } from '@harnessio/code-service-client'
import { RepositoryType } from '@harnessio/ui/views'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

interface RepoStore {
  repositories: RepositoryType[] | null
  totalPages: number
  setRepositories: (data: ListReposOkResponse, headers: Headers | undefined) => void
  page: number
  setPage: (page: number) => void
}

export const useRepoStore = create<RepoStore>(set => ({
  repositories: null,
  totalPages: 0,
  isRepoStillImporting: false,
  page: 1,
  setPage: page => set({ page }),

  setRepositories: (data, headers) => {
    const transformedRepos = data.map(repo => ({
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

    set({
      repositories: transformedRepos,
      totalPages: parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    })
  }
}))
