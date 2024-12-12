import { create } from 'zustand'

import { FindRepositoryOkResponse, ListBranchesOkResponse, RuleListOkResponse } from '@harnessio/code-service-client'
import { RepoBranch, RepoData, RuleDataType } from '@harnessio/ui/views'

import { getTotalRulesApplied } from '../../../utils/repo-branch-rules-utils'

interface RepoState {
  repoData: RepoData
  rules: RuleDataType[] | null
  securityScanning: boolean
  branches: RepoBranch[]

  // Actions to update the state
  setRepoData: (data: FindRepositoryOkResponse) => void
  setBranches: (data: ListBranchesOkResponse) => void
  setRules: (data: RuleListOkResponse) => void
  setSecurityScanning: (enabled: boolean) => void
}

export const useRepoRulesStore = create<RepoState>(set => ({
  // Initial state
  repoData: {
    name: '',
    description: '',
    defaultBranch: '',
    isPublic: false
  },
  branches: [],

  rules: null,
  securityScanning: false,

  // Actions
  setRepoData: repoData =>
    set({
      repoData: {
        name: repoData.identifier || '',
        description: repoData.description || '',
        defaultBranch: repoData.default_branch || '',
        isPublic: repoData.is_public ?? false
      }
    }),
  setRules: data => {
    const rulesData = data.map(rule => ({
      targetPatternsCount: (rule.pattern?.include?.length ?? 0) + (rule.pattern?.exclude?.length ?? 0),
      rulesAppliedCount: getTotalRulesApplied(rule),
      bypassAllowed: rule.definition?.bypass?.repo_owners === true,
      identifier: rule.identifier,
      state: rule.state ? String(rule.state) : undefined
    }))
    set({ rules: rulesData })
  },
  setBranches: data => set({ branches: data }),
  setSecurityScanning: enabled => set({ securityScanning: enabled })
}))
