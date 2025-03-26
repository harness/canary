import { PrincipalType } from '@/types'
import { RepoBranchSettingsFormFields, TranslationStore } from '@/views'
import { makeValidationUtils } from '@utils/validation'
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

export type RepoUpdateData = z.infer<ReturnType<typeof makeGeneralSettingsFormSchema>>

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

export interface IProjectRulesStore {
  rules: RuleDataType[] | null
  presetRuleData: RepoBranchSettingsFormFields | null
  principals: PrincipalType[] | null
  recentStatusChecks: string[] | null

  setRules: (data: RuleDataType[]) => void
  setPresetRuleData: (data: RepoBranchSettingsFormFields | null) => void
  setPrincipals: (data: PrincipalType[] | null) => void
  setRecentStatusChecks: (data: string[] | null) => void
}

// Constants

export const makeGeneralSettingsFormSchema = (t: TranslationStore['t']) => {
  const { required } = makeValidationUtils(t)

  return z.object({
    name: z.string().nonempty(required(t('views:repos.name'))),
    description: z.string(),
    branch: z.string(),
    access: z.enum([AccessLevel.PUBLIC, AccessLevel.PRIVATE], {})
  })
}

export const errorTypes = new Set([
  ErrorTypes.FETCH_REPO,
  ErrorTypes.FETCH_BRANCH,
  ErrorTypes.DESCRIPTION_UPDATE,
  ErrorTypes.BRANCH_UPDATE,
  ErrorTypes.UPDATE_ACCESS
])
