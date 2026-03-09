import { create } from 'zustand'

import { MessageTheme } from '@harnessio/ui/components'
import { getT } from '@harnessio/ui/context'
import { getPushRules, IPushRulesStore, PushRule, PushRulesAction } from '@harnessio/views'

import i18n from '../../../i18n/i18n'
import { pushRuleSettingsReducer } from '../reducers/repo-push-rules-reducer'

const pushRules = getPushRules(getT(i18n.t).t)

const initialState: PushRule[] = pushRules.map(rule => ({
  id: rule.id,
  checked: false,
  disabled: false,
  hidden: false,
  validationMessage: {
    theme: MessageTheme.DEFAULT,
    message: ''
  },
  input: ''
}))

export const usePushRulesStore = create<IPushRulesStore>(set => ({
  rules: initialState,
  dispatch: (action: PushRulesAction) => set(state => ({ rules: pushRuleSettingsReducer(state.rules, action) })),
  resetRules: () => set({ rules: initialState })
}))
