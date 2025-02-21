import { create } from 'zustand'

import { RepositoryType, RepoStore } from '@harnessio/ui/views'

export const useRepoStore = create<RepoStore>(set => ({
  repositories: null,
  importRepoIdentifier: null,
  totalPages: 0,
  isRepoStillImporting: false,
  page: 1,
  importToastId: null,
  setImportToastId: (id: string | null) => set({ importToastId: id }),
  setPage: page => set({ page }),

  setRepositories: (data: RepositoryType[], totalPages: number) => {
    set({
      repositories: data,
      totalPages: totalPages
    })
  },
  addRepository: (repo: RepositoryType) => {
    set(state => ({
      repositories: state.repositories ? [repo, ...state.repositories] : [repo]
    }))
  },
  updateRepository: (repo: RepositoryType) => {
    set(state => ({
      repositories: state.repositories?.map(r => (r.id === repo.id ? repo : r))
    }))
  },
  setImportRepoIdentifier(identifier: string | null) {
    set({ importRepoIdentifier: identifier })
  }
}))
