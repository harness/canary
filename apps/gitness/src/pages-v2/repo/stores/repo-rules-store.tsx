import { create } from 'zustand'

import { FindRepositoryOkResponse, RuleListOkResponse } from '@harnessio/code-service-client'
import { RepoData, RuleDataType } from '@harnessio/ui/views'

import { getTotalRulesApplied } from '../../../utils/repo-branch-rules-utils'

interface IRepoStore {
  repoData: RepoData
  rules: RuleDataType[] | null
  securityScanning: boolean

  setRepoData: (data: FindRepositoryOkResponse) => void
  setRules: (data: RuleListOkResponse) => void
  setSecurityScanning: (enabled: boolean) => void
}

export const useRepoRulesStore = create<IRepoStore>(set => ({
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
  setSecurityScanning: enabled => set({ securityScanning: enabled })
}))
