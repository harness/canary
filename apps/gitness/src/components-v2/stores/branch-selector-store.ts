import { create } from 'zustand'

import { BranchData, BranchSelectorListItem } from '@harnessio/ui/views'

interface IBranchSelectorStore {
  branchList: BranchData[] | []
  tagList: BranchSelectorListItem[] | []
  selectedBranchOrTag: BranchSelectorListItem
  setBranchList: (branchList: BranchData[]) => void
  setTagList: (tagList: BranchSelectorListItem[]) => void
  setSelectedBranchOrTag: (selectedBranchOrTag: BranchSelectorListItem) => void
}
export const useBranchSelectorStore = create<IBranchSelectorStore>(set => ({
  branchList: [],
  tagList: [],
  selectedBranchOrTag: { name: '', sha: '', default: false },
  setBranchList: (branchList: BranchData[]) => set({ branchList }),
  setTagList: (tagList: BranchSelectorListItem[]) => set({ tagList }),
  setSelectedBranchOrTag: (selectedBranchOrTag: BranchSelectorListItem) => set({ selectedBranchOrTag })
}))
