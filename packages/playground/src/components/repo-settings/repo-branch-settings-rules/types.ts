import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { RepoBranchSettingsFormFields } from './repo-branch-settings-rules-schema'

export type Rule = {
  id: string
  checked: boolean
  submenu: string[]
  selectOptions: string
}

export enum ActionType {
  TOGGLE_RULE = 'TOGGLE_RULE',
  TOGGLE_SUBMENU = 'TOGGLE_SUBMENU',
  SET_SELECT_OPTION = 'SET_SELECT_OPTION'
}

export type Action =
  | { type: ActionType.TOGGLE_RULE; ruleId: string; checked: boolean }
  | { type: ActionType.TOGGLE_SUBMENU; ruleId: string; submenuId: string; checked: boolean }
  | { type: ActionType.SET_SELECT_OPTION; ruleId: string; selectedOptions: string }

export type Dispatch = (action: Action) => void

export interface FieldProps {
  register?: UseFormRegister<RepoBranchSettingsFormFields>
  errors?: FieldErrors<RepoBranchSettingsFormFields>
  watch?: UseFormWatch<RepoBranchSettingsFormFields>
  setValue?: UseFormSetValue<RepoBranchSettingsFormFields>
}

export interface BypassUsersList {
  value: string
  label: string
}
