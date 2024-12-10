import { create } from 'zustand'

import {
  CalculateCommitDivergenceOkResponse,
  TypesBranchExtended,
  TypesRepository
} from '@harnessio/code-service-client'

import { timeAgoFromISOTime } from '../../../pages/pipeline-edit/utils/time-utils'

interface BranchData {
  id: number
  name: string
  sha: string
  timestamp: string
  user: {
    name: string
    avatarUrl: string
  }
  behindAhead: {
    behind: number
    ahead: number
    default: boolean
  }
}

interface BranchStore {
  // State
  branches: BranchData[]
  defaultBranch: string
  branchDivergence: CalculateCommitDivergenceOkResponse

  // Actions
  setBranchesData: (
    branches: TypesBranchExtended[],
    divergence: CalculateCommitDivergenceOkResponse,
    defaultBranch?: string
  ) => void
  setDefaultBranch: (metadata: TypesRepository) => void
  setBranchDivergence: (divergence: CalculateCommitDivergenceOkResponse) => void
}

export const useRepoBranchStore = create<BranchStore>(set => ({
  // Initial state
  branches: [],
  defaultBranch: '',
  branchDivergence: [],

  // Actions
  setBranchesData: (branches, divergence, defaultBranch) =>
    set({
      branches: branches.map((branch, index) => {
        const { ahead: branchAhead, behind: branchBehind } = divergence[index] || {}
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
