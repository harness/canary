import { create } from 'zustand'

import { RepositoryType, RepoStore } from '@harnessio/views'

export const useRepoStore = create<RepoStore>(set => ({
  repositories: null,
  importRepoIdentifier: null,
  totalItems: 0,
  pageSize: 25,
  isRepoStillImporting: false,
  page: 1,
  importToastId: null,
  setImportToastId: (id: string | number | null) => set({ importToastId: id }),
  setPage: page => set({ page }),
  setPageSize: (pageSize: number) => set({ pageSize, page: 1 }),
  setRepositories: (data: RepositoryType[], totalItems: number, pageSize: number) => {
    set({
      repositories: data,
      totalItems: totalItems,
      pageSize: pageSize
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
