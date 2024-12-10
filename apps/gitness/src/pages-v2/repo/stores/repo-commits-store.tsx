import { create } from 'zustand'

import { ListCommitsOkResponse } from '@harnessio/code-service-client'
import { CommitSelectorListItem, TypesCommit } from '@harnessio/ui/views'

import { PageResponseHeader } from '../../../types'

interface CommitStore {
  commits: TypesCommit[] | null
  totalPages: number
  setCommits: (data: ListCommitsOkResponse, headers: Headers | undefined) => void
  page: number
  setPage: (page: number) => void
  selectedCommit: CommitSelectorListItem
  setSelectedCommit: (selectedCommit: CommitSelectorListItem) => void
}

export const useRepoCommitsStore = create<CommitStore>(set => ({
  commits: null,
  totalPages: 0,
  page: 1,
  selectedCommit: { title: '', sha: '' },
  setPage: page => set({ page }),
  setSelectedCommit: (selectedCommit: CommitSelectorListItem) => set({ selectedCommit }),

  setCommits: (data, headers) => {
    set({
      commits: data.commits || [],
      totalPages: parseInt(headers?.get(PageResponseHeader.xTotalPages) || '0')
    })
  }
}))
