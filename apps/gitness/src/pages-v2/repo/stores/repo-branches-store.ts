import { create } from 'zustand'

import {
  CalculateCommitDivergenceOkResponse,
  TypesBranchExtended,
  TypesRepository
} from '@harnessio/code-service-client'
import { BranchData, BranchSelectorListItem, BranchSelectorTab, CommitDivergenceType } from '@harnessio/ui/views'

import { timeAgoFromISOTime } from '../../../pages/pipeline-edit/utils/time-utils'
import { PageResponseHeader } from '../../../types'

export interface IBranchSelectorStore {
  // states
  selectedBranchTag: BranchSelectorListItem
  selectedBranchType: BranchSelectorTab
  branchList: BranchData[]
  tagList: BranchSelectorListItem[]
  spaceId: string
  repoId: string
  defaultBranch: string
  branchDivergence: CommitDivergenceType[]
  xNextPage: number
  xPrevPage: number
  page: number

  //actions
  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => void
  setSelectedBranchType: (selectedBranchType: BranchSelectorTab) => void
  setTagList: (tagList: BranchSelectorListItem[]) => void
  setSpaceIdAndRepoId: (spaceId: string, repoId: string) => void
  setBranchList: (
    branches: TypesBranchExtended[],
    divergence?: CalculateCommitDivergenceOkResponse,
    defaultBranch?: string
  ) => void
  setDefaultBranch: (metadata: TypesRepository) => void
  setBranchDivergence: (divergence: CalculateCommitDivergenceOkResponse) => void
  setPage: (page: number) => void
  setPaginationFromHeaders: (headers?: Headers) => void
}

export const useRepoBranchesStore = create<IBranchSelectorStore>(set => ({
  // initial state
  defaultBranch: '',
  branchDivergence: [],
  spaceId: '',
  repoId: '',
  tagList: [{ name: '', sha: '' }],
  branchList: [],
  selectedBranchType: BranchSelectorTab.BRANCHES,
  selectedBranchTag: { name: '', sha: '' },
  xNextPage: 0,
  xPrevPage: 0,
  page: 1,

  // Actions

  setSelectedBranchTag: (selectedBranchTag: BranchSelectorListItem) => set({ selectedBranchTag }),
  setSelectedBranchType: (selectedBranchType: BranchSelectorTab) => set({ selectedBranchType }),
  setTagList: (tagList: BranchSelectorListItem[]) => set({ tagList }),
  setSpaceIdAndRepoId: (spaceId: string, repoId: string) => set({ spaceId, repoId }),
  setBranchList: (branches, divergence, defaultBranch) =>
    set({
      branchList: branches.map((branch, index) => {
        const { ahead: branchAhead, behind: branchBehind } = divergence?.[index] || {}
        return {
          id: index,
          name: branch.name || '',
          sha: branch.commit?.sha || '',
          timestamp: branch.commit?.committer?.when ? timeAgoFromISOTime(branch.commit.committer.when) : '',
          default: branch.is_default || false,
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
    }),
  setPage: page => set({ page }),
  setPaginationFromHeaders: (headers?: Headers) => {
    const xNextPage = parseInt(headers?.get(PageResponseHeader.xNextPage) || '')
    const xPrevPage = parseInt(headers?.get(PageResponseHeader.xPrevPage) || '')
    set({ xNextPage, xPrevPage })
  }
}))
