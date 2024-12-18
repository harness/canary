import { create } from 'zustand'

import { BranchRulesAction, getBranchRules, IBranchRulesStore, Rule } from '@harnessio/ui/views'

import i18n from '../../../i18n/i18n'
import { branchSettingsReducer } from '../reducers/repo-branch-rules-reducer'

const branchRules = getBranchRules(i18n.t)

const initialState: Rule[] = branchRules.map(rule => ({
  id: rule.id,
  checked: false,
  submenu: [],
  selectOptions: [],
  input: ''
}))

export const useBranchRulesStore = create<IBranchRulesStore>(set => ({
  rules: initialState,
  dispatch: (action: BranchRulesAction) => set(state => ({ rules: branchSettingsReducer(state.rules, action) }))
}))
