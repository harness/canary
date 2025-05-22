import { create } from 'zustand'

import { BranchRulesAction, getBranchRules, IBranchRulesStore, Rule } from '@harnessio/ui/views'

import i18n from '../../../i18n/i18n'
import { createI18NextAdapter } from '../../../i18n/i18nAdapter'
import { branchSettingsReducer } from '../reducers/repo-branch-rules-reducer'

const tFunc = createI18NextAdapter(i18n.t)

const branchRules = getBranchRules(tFunc)

const initialState: Rule[] = branchRules.map(rule => ({
  id: rule.id,
  checked: false,
  submenu: [],
  selectOptions: [],
  input: ''
}))

export const useBranchRulesStore = create<IBranchRulesStore>(set => ({
  rules: initialState,
  dispatch: (action: BranchRulesAction) => set(state => ({ rules: branchSettingsReducer(state.rules, action) })),
  resetRules: () => set({ rules: initialState })
}))
