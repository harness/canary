import { create } from 'zustand'

import { IExecutionListStore } from '@harnessio/ui/views'

export const useExecutionListStore = create<IExecutionListStore>(set => ({
  executions: null,
  totalPages: 0,
  page: 1,
  setPage: page => set({ page }),
  setExecutionsData: (executions, totalPages) => {
    set({
      executions,
      totalPages
    })
  }
}))
