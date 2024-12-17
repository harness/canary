import { create } from 'zustand'

import { ExecutionListStore } from '@harnessio/ui/views'

export const useExecutionListStore = create<ExecutionListStore>(set => ({
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
