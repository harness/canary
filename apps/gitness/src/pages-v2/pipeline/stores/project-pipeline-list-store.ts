import { create } from 'zustand'

import { IPipelineListStore } from '@harnessio/ui/views'

export const usePipelineListStore = create<IPipelineListStore>(set => ({
  pipelines: null,
  totalPages: 0,
  page: 1,
  setPage: page => set({ page }),
  setPipelinesData: (pipelines, totalPages) => {
    set({
      pipelines,
      totalPages
    })
  }
}))
