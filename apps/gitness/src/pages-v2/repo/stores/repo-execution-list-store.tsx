import { create } from 'zustand'

import { IExecutionListStore } from '@harnessio/ui/views'

export const useExecutionListStore = create<IExecutionListStore>(set => ({
  executions: null,
  totalItems: 0,
  pageSize: 0,
  page: 1,
  setPage: page => set({ page }),
  setExecutionsData: (executions, { totalItems, pageSize }) => {
    set({
      executions,
      totalItems,
      pageSize
    })
  }
}))
