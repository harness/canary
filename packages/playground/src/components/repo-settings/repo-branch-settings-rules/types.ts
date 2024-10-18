import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import { RepoBranchSettingsFormFields } from './repo-branch-settings-rules-schema'

export type Rule = {
  id: string
  checked: boolean
  submenu: string[]
  selectOptions: string
}

export type Action =
  | { type: 'TOGGLE_RULE'; ruleId: string; checked: boolean }
  | { type: 'TOGGLE_SUBMENU'; ruleId: string; submenuId: string; checked: boolean }
  | { type: 'SET_SELECT_OPTION'; ruleId: string; selectedOptions: string }

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
