import { PrincipalType } from '@/types'
import { RepoBranchSettingsFormFields } from '@/views'
import { z } from 'zod'

export interface RepoBranch {
  name?: string
  sha?: string
}

export interface RepoData {
  name: string
  description: string
  defaultBranch: string
  isPublic: boolean
  archived: boolean
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
  DELETE_RULE = 'deleteRule',
  ARCHIVE_REPO = 'archiveRepo',
  FETCH_GENERAL = 'fetchGeneral',
  UPDATE_GENERAL = 'updateGeneral'
}

export type RepoUpdateData = z.infer<typeof generalSettingsFormSchema>
export * from './components/repo-settings-general-features'

export interface SecurityScanning {
  secretScanning: boolean
  verifyCommitterIdentity: boolean
  vulnerabilityScanning: boolean
}

export interface RuleDataType {
  targetPatternsCount: number
  rulesAppliedCount: number
  bypassAllowed: boolean
  identifier?: string
  state?: string
  type?: 'branch' | 'tag'
}

export interface IRepoStore {
  repoData: RepoData
  rules: RuleDataType[] | null
  securityScanning: boolean
  verifyCommitterIdentity: boolean
  vulnerabilityScanning: string
  gitLfsEnabled: boolean
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: PrincipalType[] | null
  recentStatusChecks: string[] | null
}

export interface IProjectRulesStore {
  rules: RuleDataType[] | null
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: PrincipalType[] | null
  recentStatusChecks: string[] | null
  totalItems: number
  pageSize: number

  setRules: (data: RuleDataType[], headers?: Headers) => void
  setPresetRuleData: (data: RepoBranchSettingsFormFields | null) => void
  setPrincipals: (data: PrincipalType[] | null) => void
  setRecentStatusChecks: (data: string[] | null) => void
}

// Constants

export const generalSettingsFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  branch: z.string(),
  access: z.enum([AccessLevel.PUBLIC, AccessLevel.PRIVATE], {})
})

export const errorTypes = new Set([
  ErrorTypes.FETCH_REPO,
  ErrorTypes.FETCH_BRANCH,
  ErrorTypes.DESCRIPTION_UPDATE,
  ErrorTypes.BRANCH_UPDATE,
  ErrorTypes.UPDATE_ACCESS,
  ErrorTypes.ARCHIVE_REPO
])
