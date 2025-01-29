import { create } from 'zustand'

import { ICreatePipelineStore } from '@harnessio/ui/views'

export const useCreatePipelineStore = create<ICreatePipelineStore>(set => ({
  branchNames: undefined,
  defaultBranch: 'main',
  isLoadingBranchNames: false,
  setBranchesState: (payload: { branchNames?: string[]; defaultBranch?: string; isLoadingBranchNames: boolean }) => {
    set(payload)
  },
  error: undefined,
  setError: (error?: { message: string }) => {
    set({ error })
  }
}))
