import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { MessageTheme } from '@components/index'
import { MultiSelectOption } from '@components/multi-select'
import { z } from 'zod'

import { MergeStrategy } from '../pull-request/details/pull-request-details-types'

export type RepoBranchSettingsFormFields = z.infer<typeof repoBranchSettingsFormSchema>

export type Rule = {
  id: string
  checked: boolean
  disabled: boolean
  hidden: boolean
  validationMessage: {
    theme: MessageTheme
    message: string
  }
  submenu: MergeStrategy[]
  selectOptions: MultiSelectOption[]
  input: string
}

export enum BranchRulesActionType {
  TOGGLE_RULE = 'TOGGLE_RULE',
  TOGGLE_SUBMENU = 'TOGGLE_SUBMENU',
  SET_SELECT_OPTION = 'SET_SELECT_OPTION',
  SET_INITIAL_RULES = 'SET_INITAL_RULES',
  SET_INPUT_VALUE = 'SET_INPUT_VALUE'
}

export type BranchRulesAction =
  | { type: BranchRulesActionType.TOGGLE_RULE; ruleId: string; checked: boolean }
  | { type: BranchRulesActionType.TOGGLE_SUBMENU; ruleId: string; submenuId: string; checked: boolean }
  | { type: BranchRulesActionType.SET_SELECT_OPTION; ruleId: string; selectedOptions: MultiSelectOption[] }
  | { type: BranchRulesActionType.SET_INITIAL_RULES; payload: Rule[] }
  | { type: BranchRulesActionType.SET_INPUT_VALUE; ruleId: string; value: string }

export type Dispatch = (action: BranchRulesAction) => void

export interface FieldProps {
  register?: UseFormRegister<RepoBranchSettingsFormFields>
  errors?: FieldErrors<RepoBranchSettingsFormFields>
  watch?: UseFormWatch<RepoBranchSettingsFormFields>
  setValue?: UseFormSetValue<RepoBranchSettingsFormFields>
}

export enum BranchRuleId {
  REQUIRE_LATEST_COMMIT = 'require_latest_commit',
  REQUIRE_NO_CHANGE_REQUEST = 'require_no_change_request',
  COMMENTS = 'comments',
  STATUS_CHECKS = 'status_checks',
  MERGE = 'merge',
  DELETE_BRANCH = 'delete_branch',
  BLOCK_BRANCH_CREATION = 'create_forbidden',
  BLOCK_BRANCH_DELETION = 'delete_forbidden',
  BLOCK_BRANCH_UPDATE = 'update_forbidden_with_merge_block',
  BLOCK_FORCE_PUSH = 'update_force_forbidden',
  REQUIRE_PULL_REQUEST = 'update_forbidden_without_merge_block',
  ENABLE_DEFAULT_REVIEWERS = 'enable_default_reviewers',
  REQUIRE_MINIMUM_DEFAULT_REVIEWER_COUNT = 'require_minimum_default_reviewer_count',
  REQUIRE_CODE_REVIEW = 'require_minimum_count',
  REQUIRE_CODE_OWNERS = 'require_code_owners',
  AUTO_ADD_CODE_OWNERS = 'request_code_owners'
}

export enum PatternsButtonType {
  INCLUDE = 'Include',
  EXCLUDE = 'Exclude'
}

export enum EnumBypassListType {
  SERVICE = 'service',
  SERVICEACCOUNT = 'serviceaccount',
  USER = 'user',
  USER_GROUP = 'user_group'
}

export interface NormalizedPrincipal {
  id: number
  email_or_identifier: string
  type: EnumBypassListType
  display_name: string
}

export type IBranchRulesStore = {
  rules: Rule[]
  dispatch: Dispatch
  resetRules: () => void
}

// Constants

export const repoBranchSettingsFormSchema = z.object({
  identifier: z.string().min(1, 'Name is required'),
  description: z.string(),
  pattern: z.string(),
  patterns: z.array(
    z.object({
      pattern: z.string(),
      option: z.enum([PatternsButtonType.INCLUDE, PatternsButtonType.EXCLUDE])
    })
  ),
  state: z.boolean(),
  bypass: z.array(
    z.object({
      id: z.number(),
      key: z.string(),
      type: z.nativeEnum(EnumBypassListType),
      title: z.string().optional()
    })
  ),
  default: z.boolean().optional(),
  repo_owners: z.boolean().optional(),
  rules: z.array(
    z.object({
      id: z.string(),
      checked: z.boolean(),
      disabled: z.boolean(),
      hidden: z.boolean(),
      validationMessage: z.object({
        theme: z.nativeEnum(MessageTheme),
        message: z.string()
      }),
      submenu: z.array(z.nativeEnum(MergeStrategy)),
      selectOptions: z.array(z.object({ id: z.union([z.string(), z.number()]), key: z.string() })),
      input: z.string()
    })
  )
})
