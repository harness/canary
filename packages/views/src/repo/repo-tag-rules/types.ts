import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { z } from 'zod'

import { EnumBypassListType, PatternsButtonType, TargetReposButtonType } from '../repo-branch-rules/types'

export type RepoTagSettingsFormFields = z.infer<typeof repoTagSettingsFormSchema>

export type TagRule = {
  id: string
  checked: boolean
  disabled: boolean
}

export enum TagRulesActionType {
  TOGGLE_RULE = 'TOGGLE_RULE',
  SET_INITIAL_RULES = 'SET_INITAL_RULES'
}

export type TagRulesAction =
  | { type: TagRulesActionType.TOGGLE_RULE; ruleId: string; checked: boolean }
  | { type: TagRulesActionType.SET_INITIAL_RULES; payload: TagRule[] }

export type TagRulesDispatcher = (action: TagRulesAction) => void

export interface TagFieldProps {
  register?: UseFormRegister<RepoTagSettingsFormFields>
  errors?: FieldErrors<RepoTagSettingsFormFields>
  watch?: UseFormWatch<RepoTagSettingsFormFields>
  setValue?: UseFormSetValue<RepoTagSettingsFormFields>
}

export enum TagRuleId {
  BLOCK_TAG_CREATION = 'create_forbidden',
  BLOCK_TAG_DELETION = 'delete_forbidden',
  BLOCK_TAG_UPDATE = 'update_force_forbidden'
}

export type ITagRulesStore = {
  rules: TagRule[]
  dispatch: TagRulesDispatcher
  resetRules: () => void
}

// Constants

export const repoTagSettingsFormSchema = z.object({
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
  bypass: z.array(
    z.object({
      id: z.number(),
      key: z.string(),
      type: z.nativeEnum(EnumBypassListType),
      title: z.string().optional(),
      icon: z.string().optional()
    })
  ),
  state: z.boolean(),
  repo_owners: z.boolean().optional(),
  rules: z.array(
    z.object({
      id: z.string(),
      checked: z.boolean(),
      disabled: z.boolean()
    })
  )
})
