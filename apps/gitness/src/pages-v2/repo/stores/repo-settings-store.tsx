import { create } from 'zustand'

import {
  FindRepositoryOkResponse,
  ListPrincipalsOkResponse,
  ListStatusCheckRecentOkResponse,
  RuleGetOkResponse,
  RuleListOkResponse
} from '@harnessio/code-service-client'
import { BypassUsersList, RepoBranchSettingsFormFields, RepoData, RuleDataType } from '@harnessio/ui/views'

import { getTotalRulesApplied, transformDataFromApi } from '../../../utils/repo-branch-rules-utils'

interface IRepoStore {
  repoData: RepoData
  rules: RuleDataType[] | null
  securityScanning: boolean
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: BypassUsersList[] | null
  recentStatusChecks: ListStatusCheckRecentOkResponse | null

  setRepoData: (data: FindRepositoryOkResponse) => void
  setRules: (data: RuleListOkResponse) => void
  setSecurityScanning: (enabled: boolean) => void
  setPresetRuleData: (data: RuleGetOkResponse) => void
  setPrincipals: (data: ListPrincipalsOkResponse) => void
  setRecentStatusChecks: (data: ListStatusCheckRecentOkResponse) => void
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
  presetRuleData: null,

  rules: null,
  securityScanning: false,
  principals: null,
  recentStatusChecks: null,

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
  setSecurityScanning: enabled => set({ securityScanning: enabled }),
  setPresetRuleData: data => {
    const transformedData = transformDataFromApi(data)

    set({ presetRuleData: transformedData })
  },
  setPrincipals: data => {
    set({ principals: data as BypassUsersList[] })
  },
  setRecentStatusChecks: data => {
    set({ recentStatusChecks: data })
  }
}))
