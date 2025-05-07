import { create } from 'zustand'

import { ICommitDetailsStore } from '@harnessio/ui/views'

export const useCommitDetailsStore = create<ICommitDetailsStore>(set => ({
  diffs: [],
  commitData: null,
  diffStats: null,
  isVerified: false,
  setDiffs: diffs => set({ diffs }),
  setCommitData: commitData => set({ commitData }),
  setDiffStats: diffStats => set({ diffStats }),
  setIsVerified: isVerified => set({ isVerified })
}))
