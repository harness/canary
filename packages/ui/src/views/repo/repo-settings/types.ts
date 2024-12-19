import { BypassUsersList, RepoBranchSettingsFormFields } from '../repo-branch-rules/types'

export interface RepoBranch {
  name?: string
  sha?: string
}

export interface RepoData {
  name: string
  description: string
  defaultBranch: string
  isPublic: boolean
}

export enum AccessLevel {
  PRIVATE = '2',
  PUBLIC = '1'
}
export enum ErrorTypes {
  FETCH_REPO = 'fetchRepo',
  FETCH_BRANCH = 'fetchBranch',
  DESCRIPTION_UPDATE = 'descriptionUpdate',
  BRANCH_UPDATE = 'branchUpdate',
  UPDATE_ACCESS = 'updateAccess',
  FETCH_SECURITY = 'fetchSecurity',
  UPDATE_SECURITY = 'updateSecurity',
  DELETE_REPO = 'deleteRepo',
  FETCH_RULES = 'fetchRules',
  DELETE_RULE = 'deleteRule'
}
export interface RepoUpdateData {
  name: string
  description: string
  branch: string
  access: AccessLevel
}
export interface SecurityScanning {
  secretScanning: boolean
}

export interface RuleDataType {
  targetPatternsCount?: number
  rulesAppliedCount?: number
  bypassAllowed?: boolean
  identifier?: string
  state?: string
}

export interface IRepoStore {
  repoData: RepoData
  rules: RuleDataType[] | null
  securityScanning: boolean
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: BypassUsersList[] | null
  recentStatusChecks: string[] | null
}
