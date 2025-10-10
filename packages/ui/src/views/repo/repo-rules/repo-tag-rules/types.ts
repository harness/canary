import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { z } from 'zod'

import { EnumBypassListType, PatternsButtonType, Rule, RulesAction } from '../types'

export type RepoTagSettingsFormFields = z.infer<typeof repoTagSettingsFormSchema>

export type TagRulesDispatcher = (action: RulesAction) => void

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
  rules: Rule[]
  dispatch: TagRulesDispatcher
  resetRules: () => void
}
