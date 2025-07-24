import { create } from 'zustand'

import { MessageTheme } from '@harnessio/ui/components'
import { getT } from '@harnessio/ui/context'
import { BranchRulesAction, getBranchRules, IBranchRulesStore, Rule } from '@harnessio/ui/views'

import i18n from '../../../i18n/i18n'
import { branchSettingsReducer } from '../reducers/repo-branch-rules-reducer'

const branchRules = getBranchRules(getT(i18n.t).t)

const initialState: Rule[] = branchRules.map(rule => ({
  id: rule.id,
  checked: false,
  disabled: false,
  hidden: false,
  validationMessage: {
    theme: MessageTheme.DEFAULT,
    message: ''
  },
  submenu: [],
  selectOptions: [],
  input: ''
}))

export const useBranchRulesStore = create<IBranchRulesStore>(set => ({
  rules: initialState,
  dispatch: (action: BranchRulesAction) => set(state => ({ rules: branchSettingsReducer(state.rules, action) })),
  resetRules: () => set({ rules: initialState })
}))
