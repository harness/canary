import { create } from 'zustand'

import {
  FindRepositoryOkResponse,
  ListPrincipalsOkResponse,
  ListStatusCheckRecentOkResponse,
  ListUsergroupsOkResponse,
  RepoRuleGetOkResponse,
  RepoRuleListOkResponse,
  TypesUserGroupInfo
} from '@harnessio/code-service-client'
import { PrincipalType } from '@harnessio/ui/types'
import {
  RepoBranchSettingsFormFields,
  RepoData,
  RuleDataType,
  RuleType,
  VulnerabilityScanningType
} from '@harnessio/ui/views'

import { getTotalRulesApplied, transformDataFromApi } from '../../../utils/repo-branch-rules-utils'

interface IRepoStore {
  repoData: RepoData
  rules: RuleDataType[] | null
  securityScanning: boolean
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: PrincipalType[] | null
  userGroups: TypesUserGroupInfo[] | null
  recentStatusChecks: ListStatusCheckRecentOkResponse | null
  verifyCommitterIdentity: boolean
  gitLfsEnabled: boolean
  vulnerabilityScanning: VulnerabilityScanningType
  setRepoData: (data: FindRepositoryOkResponse) => void
  setRules: (data: RepoRuleListOkResponse) => void
  setSecurityScanning: (enabled: boolean) => void
  setGitLfsEnabled: (enabled: boolean) => void
  setPresetRuleData: (data: RepoRuleGetOkResponse | null) => void
  setUserGroups: (data: ListUsergroupsOkResponse | null) => void
  setPrincipals: (data: ListPrincipalsOkResponse | null) => void
  setRecentStatusChecks: (data: ListStatusCheckRecentOkResponse | null) => void
  setVerifyCommitterIdentity: (enabled: boolean) => void
  setVulnerabilityScanning: (enabled: VulnerabilityScanningType) => void
}

export const useRepoRulesStore = create<IRepoStore>(set => ({
  // Initial state
  repoData: {
    name: '',
    description: '',
    defaultBranch: '',
    isPublic: false,
    archived: false
  },
  branches: [],
  presetRuleData: null,
  gitLfsEnabled: false,
  rules: null,
  securityScanning: false,
  verifyCommitterIdentity: false,
  principals: null,
  userGroups: null,
  recentStatusChecks: null,
  vulnerabilityScanning: VulnerabilityScanningType.DISABLED,

  // Actions
  setRepoData: repoData =>
    set({
      repoData: {
        name: repoData.identifier || '',
        description: repoData.description || '',
        defaultBranch: repoData.default_branch || '',
        isPublic: repoData.is_public ?? false,
        archived: repoData.archived ?? false
      }
    }),
  setRules: data => {
    const rulesData = data.map(rule => ({
      targetPatternsCount: (rule.pattern?.include?.length ?? 0) + (rule.pattern?.exclude?.length ?? 0),
      rulesAppliedCount: getTotalRulesApplied(rule),
      bypassAllowed:
        (rule.definition?.bypass?.user_ids?.length ?? 0) > 0 ||
        (rule.definition?.bypass?.user_group_ids?.length ?? 0) > 0 ||
        rule.definition?.bypass?.repo_owners === true,
      identifier: rule.identifier,
      state: rule.state ? String(rule.state) : undefined,
      type: rule.type as RuleType,
      scope: rule.scope ?? 0
    }))
    set({ rules: rulesData })
  },
  setSecurityScanning: enabled => set({ securityScanning: enabled }),
  setGitLfsEnabled: enabled => set({ gitLfsEnabled: enabled }),
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
  setUserGroups: data => {
    if (!data) {
      set({ userGroups: null })
      return
    }
    set({ userGroups: data as TypesUserGroupInfo[] })
  },
  setRecentStatusChecks: data => {
    if (!data) {
      set({ recentStatusChecks: null })
      return
    }
    set({ recentStatusChecks: data })
  },
  setVerifyCommitterIdentity: enabled => set({ verifyCommitterIdentity: enabled }),
  setVulnerabilityScanning: enabled => set({ vulnerabilityScanning: enabled })
}))
