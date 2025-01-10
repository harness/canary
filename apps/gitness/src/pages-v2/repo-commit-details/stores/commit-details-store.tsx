import { create } from 'zustand'

import { DiffFileEntry } from '@harnessio/ui/views'

interface ICommitDetailsStore {
  diffs: DiffFileEntry[]
  setDiffs: (diffs: DiffFileEntry[]) => void
}

export const useCommitDetailsStore = create<ICommitDetailsStore>(set => ({
  diffs: [],
  setDiffs: diffs => set({ diffs })
}))
