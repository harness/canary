import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { repoBranchSettingsFormSchema } from './repo-branch-settings-rules-schema'
import { z } from 'zod'

export type RepoBranchSettingsFormFields = z.infer<typeof repoBranchSettingsFormSchema>

export enum MergeStrategy {
  Merge = 'merge',
  Rebase = 'rebase',
  Squash = 'squash'
}

export type Rule = {
  id: string
  checked: boolean
  submenu: MergeStrategy[]
  selectOptions: string[]
  input: string
}

export enum ActionType {
  TOGGLE_RULE = 'TOGGLE_RULE',
  TOGGLE_SUBMENU = 'TOGGLE_SUBMENU',
  SET_SELECT_OPTION = 'SET_SELECT_OPTION',
  SET_INITIAL_RULES = 'SET_INITAL_RULES',
  SET_INPUT_VALUE = 'SET_INPUT_VALUE'
}

export type Action =
  | { type: ActionType.TOGGLE_RULE; ruleId: string; checked: boolean }
  | { type: ActionType.TOGGLE_SUBMENU; ruleId: string; submenuId: string; checked: boolean }
  | { type: ActionType.SET_SELECT_OPTION; ruleId: string; checkName: string }
  | { type: ActionType.SET_INITIAL_RULES; payload: Rule[] }
  | { type: ActionType.SET_INPUT_VALUE; ruleId: string; value: string }

export type Dispatch = (action: Action) => void

export interface FieldProps {
  register?: UseFormRegister<RepoBranchSettingsFormFields>
  errors?: FieldErrors<RepoBranchSettingsFormFields>
  watch?: UseFormWatch<RepoBranchSettingsFormFields>
  setValue?: UseFormSetValue<RepoBranchSettingsFormFields>
}

export interface BypassUsersList {
  id: number
  uid: string
  display_name: string
  email: string
  type: 'user' | 'service' | 'serviceaccount'
  created: number
  updated: number
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
  REQUIRE_PULL_REQUEST = 'update_forbidden',
  REQUIRE_CODE_REVIEW = 'require_minimum_count'
}

export enum PatternsButtonType {
  INCLUDE = 'Include',
  EXCLUDE = 'Exclude'
}
