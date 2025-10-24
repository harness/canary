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

export type RepoUpdateData = z.infer<typeof generalSettingsFormSchema>

export interface SecurityScanning {
  secretScanning: boolean
}

export interface RuleDataType {
  targetPatternsCount: number
  rulesAppliedCount: number
  bypassAllowed: boolean
  identifier?: string
  state?: string
}

export interface IRepoStore {
  repoData: RepoData
  rules: RuleDataType[] | null
  securityScanning: boolean
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: PrincipalType[] | null
  recentStatusChecks: string[] | null
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
  ErrorTypes.UPDATE_ACCESS
])
