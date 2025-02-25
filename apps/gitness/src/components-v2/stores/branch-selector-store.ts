import { create } from 'zustand'

import { BranchData, BranchSelectorListItem, BranchSelectorTab } from '@harnessio/ui/views'

interface IBranchSelectorStore {
  branchList: BranchData[] | []
  tagList: BranchSelectorListItem[] | []
  selectedBranchOrTag: BranchSelectorListItem
  selectedRefType: BranchSelectorTab

  setBranchList: (branchList: BranchData[]) => void
  setTagList: (tagList: BranchSelectorListItem[]) => void
  setSelectedBranchOrTag: (selectedBranchOrTag: BranchSelectorListItem) => void
  setRefType: (selectedRefType: BranchSelectorTab) => void
}
export const useBranchSelectorStore = create<IBranchSelectorStore>(set => ({
  branchList: [],
  tagList: [],
  selectedBranchOrTag: { name: '', sha: '', default: false },
  selectedRefType: BranchSelectorTab.BRANCHES,
  setBranchList: (branchList: BranchData[]) => set({ branchList }),
  setTagList: (tagList: BranchSelectorListItem[]) => set({ tagList }),
  setSelectedBranchOrTag: (selectedBranchOrTag: BranchSelectorListItem) => set({ selectedBranchOrTag }),
  setRefType: (selectedRefType: BranchSelectorTab) => set({ selectedRefType })
}))
