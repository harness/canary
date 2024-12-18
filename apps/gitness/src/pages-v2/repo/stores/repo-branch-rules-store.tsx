import { create } from 'zustand'

import { branchRules, BranchRulesAction, IBranchRulesStore, Rule } from '@harnessio/ui/views'

import { branchSettingsReducer } from '../reducers/repo-branch-rules-reducer'

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
