import { create } from 'zustand'

import { BranchData, BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore } from '@harnessio/ui/views'

export const useRepoBranchesStore = create<IBranchSelectorStore>(set => ({
  // initial state
  defaultBranch: '',
  spaceId: '',
  repoId: '',
  tagList: [{ name: '', sha: '' }],
  branchList: [],
  selectedRefType: BranchSelectorTab.BRANCHES,
  xNextPage: 0,
  xPrevPage: 0,
  page: 1,
  selectedBranchTag: null,

  // Actions
  setSelectedRefType: (selectedRefType: BranchSelectorTab) => set({ selectedRefType }),
  setTagList: (tagList: BranchSelectorListItem[]) => set({ tagList }),
  setSpaceIdAndRepoId: (spaceId: string, repoId: string) => set({ spaceId, repoId }),
  setBranchList: (branches: BranchData[]) => set({ branchList: branches }),
  setPage: page => set({ page }),
  setPaginationFromHeaders: (xNextPage: number, xPrevPage: number) => set({ xNextPage, xPrevPage }),
  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => set({ selectedBranchTag }),
  setDefaultBranch: (branch: string) => set({ defaultBranch: branch })
}))
