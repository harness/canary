import { create } from 'zustand'

import {
  ListPrincipalsOkResponse,
  ListStatusCheckRecentOkResponse,
  RepoRuleGetOkResponse,
  RepoRuleListOkResponse
} from '@harnessio/code-service-client'
import { PrincipalType } from '@harnessio/ui/types'
import { RepoBranchSettingsFormFields, RuleDataType } from '@harnessio/ui/views'

import { getTotalRulesApplied, transformDataFromApi } from '../../../utils/repo-branch-rules-utils'

interface IProjectRulesStore {
  rules: RuleDataType[] | null
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: PrincipalType[] | null
  recentStatusChecks: ListStatusCheckRecentOkResponse | null

  setRules: (data: RepoRuleListOkResponse) => void
  setPresetRuleData: (data: RepoRuleGetOkResponse | null) => void
  setPrincipals: (data: ListPrincipalsOkResponse | null) => void
  setRecentStatusChecks: (data: ListStatusCheckRecentOkResponse | null) => void
}

export const useProjectRulesStore = create<IProjectRulesStore>(set => ({
  // Initial state

  presetRuleData: null,

  rules: null,
  principals: null,
  recentStatusChecks: null,

  // Actions
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
  setPresetRuleData: data => {
    if (!data) {
      set({ presetRuleData: null })
      return
    }
    const transformedData = transformDataFromApi(data)

    set({ presetRuleData: transformedData })
  },
  setPrincipals: data => {
    if (!data) {
      set({ principals: null })
      return
    }
    set({ principals: data as PrincipalType[] })
  },
  setRecentStatusChecks: data => {
    if (!data) {
      set({ recentStatusChecks: null })
      return
    }
    set({ recentStatusChecks: data })
  }
}))
