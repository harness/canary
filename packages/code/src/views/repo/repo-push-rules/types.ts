import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { z } from 'zod'

import { MessageTheme } from '@harnessio/ui/components'

import { EnumBypassListType, PatternsButtonType, TargetReposButtonType } from '../repo-branch-rules/types'

export type RepoPushRulesSettingsFormFields = z.infer<typeof repoPushRuleSettingsFormSchema>

export type PushRule = {
  id: string
  checked: boolean
  disabled: boolean
  hidden: boolean
  validationMessage: {
    theme: MessageTheme
    message: string
  }
  input: string
}

export enum PushRulesActionType {
  TOGGLE_RULE = 'TOGGLE_RULE',
  SET_INITIAL_RULES = 'SET_INITAL_RULES',
  SET_INPUT_VALUE = 'SET_INPUT_VALUE'
}

export type PushRulesAction =
  | { type: PushRulesActionType.TOGGLE_RULE; ruleId: string; checked: boolean }
  | { type: PushRulesActionType.SET_INITIAL_RULES; payload: PushRule[] }
  | { type: PushRulesActionType.SET_INPUT_VALUE; ruleId: string; value: string }

export type PushRulesDispatch = (action: PushRulesAction) => void

export interface PushRuleFieldProps {
  register?: UseFormRegister<RepoPushRulesSettingsFormFields>
  errors?: FieldErrors<RepoPushRulesSettingsFormFields>
  watch?: UseFormWatch<RepoPushRulesSettingsFormFields>
  setValue?: UseFormSetValue<RepoPushRulesSettingsFormFields>
}

export enum PushRuleId {
  FILE_SIZE_LIMIT = 'push.file_size_limit',
  PRINCIPAL_COMMITTER_MATCH = 'push.principal_committer_match',
  SECRET_SCANNING_ENABLED = 'push.secret_scanning_enabled'
}

export type IPushRulesStore = {
  rules: PushRule[]
  dispatch: PushRulesDispatch
  resetRules: () => void
}

// Constants

export const repoPushRuleSettingsFormSchema = z.object({
  identifier: z.string().min(1, 'Name is required'),
  description: z.string(),
  pattern: z.string(),
  patterns: z.array(
    z.object({
      pattern: z.string(),
      option: z.enum([PatternsButtonType.INCLUDE, PatternsButtonType.EXCLUDE])
    })
  ),
  repoPattern: z.string(),
  repoPatterns: z.array(
    z.object({
      pattern: z.string(),
      option: z.enum([PatternsButtonType.INCLUDE, PatternsButtonType.EXCLUDE])
    })
  ),
  targetRepos: z
    .array(
      z.object({
        id: z.number(),
        type: z.nativeEnum(TargetReposButtonType),
        info: z
          .object({
            id: z.number().optional(),
            parent_id: z.number().optional(),
            identifier: z.string().optional(),
            path: z.string().optional(),
            default_branch: z.string().optional()
          })
          .optional()
      })
    )
    .optional(),
  state: z.boolean(),
  bypass: z.array(
    z.object({
      id: z.number(),
      key: z.string(),
      type: z.nativeEnum(EnumBypassListType),
      title: z.string().optional(),
      icon: z.string().optional()
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
      input: z.string()
    })
  )
})
