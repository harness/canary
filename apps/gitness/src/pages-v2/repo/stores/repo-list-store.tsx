import { create } from 'zustand'

import { RepositoryType, RepoStore } from '@harnessio/ui/views'

export const useRepoStore = create<RepoStore>(set => ({
  repositories: null,
  totalPages: 0,
  isRepoStillImporting: false,
  page: 1,
  setPage: page => set({ page }),

  setRepositories: (data: RepositoryType[], totalPages: number) => {
    set({
      repositories: data,
      totalPages: totalPages
    })
  }
}))
