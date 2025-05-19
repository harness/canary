import { create } from 'zustand'

import { IPipelineListStore } from '@harnessio/ui/views'

export const usePipelineListStore = create<IPipelineListStore>(set => ({
  pipelines: null,
  totalItems: 0,
  pageSize: 0,
  page: 1,
  setPage: page => set({ page }),
  setPipelinesData: (pipelines, { totalItems, pageSize }) => {
    set({
      pipelines,
      totalItems,
      pageSize
    })
  }
}))
