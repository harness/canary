import { create } from 'zustand'

import { getT } from '@harnessio/ui/context'
import { getTagRules, ITagRulesStore, TagRule, TagRulesAction } from '@harnessio/ui/views'

import i18n from '../../../i18n/i18n'
import { tagSettingsReducer } from '../reducers/repo-tag-rules-reducer'

const tagRules = getTagRules(getT(i18n.t).t)

const initialState: TagRule[] = tagRules.map(rule => ({
  id: rule.id,
  checked: false,
  disabled: false
}))

export const useTagRulesStore = create<ITagRulesStore>(set => ({
  rules: initialState,
  dispatch: (action: TagRulesAction) => set(state => ({ rules: tagSettingsReducer(state.rules, action) })),
  resetRules: () => set({ rules: initialState })
}))
