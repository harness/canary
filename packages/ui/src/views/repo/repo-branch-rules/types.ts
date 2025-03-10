import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { TranslationStore } from '@/views'
import { TFunction } from 'i18next'
import { z } from 'zod'

export type RepoBranchSettingsFormFields = z.infer<ReturnType<typeof makeRepoBranchSettingsFormSchema>>

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
  SET_INITIAL_RULES = 'SET_INITIAL_RULES',
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
  register: UseFormRegister<RepoBranchSettingsFormFields>
  errors: FieldErrors<RepoBranchSettingsFormFields>
  watch: UseFormWatch<RepoBranchSettingsFormFields>
  setValue: UseFormSetValue<RepoBranchSettingsFormFields>
  t: TFunction
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
  REQUIRE_CODE_REVIEW = 'require_minimum_count',
  REQUIRE_CODE_OWNERS = 'require_code_owners'
}

export enum PatternsButtonType {
  INCLUDE = 'Include',
  EXCLUDE = 'Exclude'
}

export type IBranchRulesStore = {
  rules: Rule[]
  dispatch: Dispatch
}

// Constants

export const makeRepoBranchSettingsFormSchema = (t: TranslationStore['t']) =>
  z.object({
    identifier: z
      .string()
      .trim()
      .nonempty(t('views:repos.rules.validation.ruleNameMin', 'Please provide rule name'))
      .max(100, t('views:repos.rules.validation.ruleNameMax', 'Rule name must be no longer than 100 characters'))
      .regex(
        /^[a-zA-Z0-9._-\s]+$/,
        t(
          'views:repos.rules.validation.ruleNameRegex',
          'Rule name must contain only letters, numbers, and the characters: - _ .'
        )
      )
      .refine(
        data => !data.includes(' '),
        t('views:repos.rules.validation.ruleNameNoSpaces', 'Rule name cannot contain spaces')
      ),
    description: z.string(),
    pattern: z.string(),
    patterns: z.array(
      z.object({ pattern: z.string(), option: z.enum([PatternsButtonType.INCLUDE, PatternsButtonType.EXCLUDE]) })
    ),
    state: z.boolean(),
    bypass: z.array(z.object({ id: z.number(), display_name: z.string() })),
    default: z.boolean().optional(),
    repo_owners: z.boolean().optional(),
    rules: z.array(
      z.object({
        id: z.string(),
        checked: z.boolean(),
        submenu: z.array(z.enum(['merge', 'rebase', 'squash'])),
        selectOptions: z.array(z.string()),
        input: z.string()
      })
    )
  })
