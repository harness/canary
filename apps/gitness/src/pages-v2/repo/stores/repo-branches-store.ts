import { create } from 'zustand'

import {
  CalculateCommitDivergenceOkResponse,
  TypesBranchExtended,
  TypesRepository
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, IBranchSelectorStore } from '@harnessio/ui/views'

import { timeAgoFromISOTime } from '../../../pages/pipeline-edit/utils/time-utils'

interface BranchStore {
  // State
  defaultBranch: string
  branchDivergence: CalculateCommitDivergenceOkResponse

  // Actions
  setBranchesData: (
    branches: TypesBranchExtended[],
    divergence?: CalculateCommitDivergenceOkResponse,
    defaultBranch?: string
  ) => void
  setDefaultBranch: (metadata: TypesRepository) => void
  setBranchDivergence: (divergence: CalculateCommitDivergenceOkResponse) => void
}

export const useRepoBranchesStore = create<IBranchSelectorStore & BranchStore>(set => ({
  // initial state
  defaultBranch: '',
  branchDivergence: [],
  spaceId: '',
  repoId: '',
  tagList: [{ name: '', sha: '' }],
  branchList: [],
  selectedBranchType: BranchSelectorTab.BRANCHES,
  selectedBranchTag: { name: '', sha: '' },

  // Actions

  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => set({ selectedBranchTag }),

  setSelectedBranchType: (selectedBranchType: BranchSelectorTab) => set({ selectedBranchType }),

  setBranchList: (branchList?: BranchSelectorListItem[]) => set({ branchList }),

  setTagList: (tagList: BranchSelectorListItem[]) => set({ tagList }),

  setSpaceIdAndRepoId: (spaceId: string, repoId: string) => set({ spaceId, repoId }),

  setBranchesData: (branches, divergence, defaultBranch) =>
    set({
      branchList: branches.map((branch, index) => {
        const { ahead: branchAhead, behind: branchBehind } = divergence?.[index] || {}
        return {
          id: index,
          name: branch.name || '',
          sha: branch.commit?.sha || '',
          timestamp: branch.commit?.committer?.when ? timeAgoFromISOTime(branch.commit.committer.when) : '',
          user: {
            name: branch.commit?.committer?.identity?.name || '',
            avatarUrl: ''
          },
          behindAhead: {
            behind: branchBehind || 0,
            ahead: branchAhead || 0,
            default: defaultBranch === branch.name
          }
        }
      }),
      branchDivergence: divergence
    }),
  setDefaultBranch: metadata =>
    set({
      defaultBranch: metadata?.default_branch || ''
    }),
  setBranchDivergence: divergence =>
    set({
      branchDivergence: divergence
    })
}))
