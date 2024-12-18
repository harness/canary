import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { z } from 'zod'

import { repoBranchSettingsFormSchema } from './components/repo-branch-rules-schema'

export type RepoBranchSettingsFormFields = z.infer<typeof repoBranchSettingsFormSchema>

export type Rule = {
  id: string
  checked: boolean
  submenu: ('merge' | 'rebase' | 'squash')[]
  selectOptions: string[]
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
  | { type: BranchRulesActionType.SET_SELECT_OPTION; ruleId: string; checkName: string }
  | { type: BranchRulesActionType.SET_INITIAL_RULES; payload: Rule[] }
  | { type: BranchRulesActionType.SET_INPUT_VALUE; ruleId: string; value: string }

export type Dispatch = (action: BranchRulesAction) => void

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

export type IBranchRulesStore = {
  rules: Rule[]
  dispatch: Dispatch
}
