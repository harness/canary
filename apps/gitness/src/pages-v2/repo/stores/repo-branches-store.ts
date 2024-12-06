import { create } from 'zustand'

import { BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore } from '@harnessio/ui/views'

export const useRepoBranchesStore = create<IBranchSelectorStore>(set => ({
  selectedBranchTag: { name: '', sha: '' },
  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => set({ selectedBranchTag }),

  selectedBranchType: BranchSelectorTab.BRANCHES,
  setSelectedBranchType: (selectedBranchType: BranchSelectorTab) => set({ selectedBranchType }),

  branchList: [{ name: '', sha: '' }],
  setBranchList: (branchList?: BranchSelectorListItem[]) => set({ branchList }),

  tagList: [{ name: '', sha: '' }],
  setTagList: (tagList: BranchSelectorListItem[]) => set({ tagList }),

  spaceId: '',
  repoId: '',
  setSpaceIdAndRepoId: (spaceId: string, repoId: string) => set({ spaceId, repoId })
}))
