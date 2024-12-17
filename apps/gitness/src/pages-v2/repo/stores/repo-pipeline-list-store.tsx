import { create } from 'zustand'

import { PipelineListStore } from '@harnessio/ui/views'

export const usePipelineListStore = create<PipelineListStore>(set => ({
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
