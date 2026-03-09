import { create } from 'zustand'

import { ICommitDetailsStore } from '@harnessio/views'

export const useCommitDetailsStore = create<ICommitDetailsStore>(set => ({
  diffs: [],
  commitData: null,
  diffStats: null,
  isVerified: false,
  commitSHA: '',
  setDiffs: diffs => set({ diffs }),
  setCommitData: commitData => set({ commitData }),
  setDiffStats: diffStats => set({ diffStats }),
  setIsVerified: isVerified => set({ isVerified }),
  setCommitSHA: commitSHA => set({ commitSHA })
}))
