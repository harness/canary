import { create } from 'zustand'

import { PrincipalType } from '@harnessio/ui/types'
import { IProjectRulesStore } from '@harnessio/ui/views'

export const useProjectRulesStore = create<IProjectRulesStore>(set => ({
  // Initial state

  presetRuleData: null,
  rules: null,
  principals: null,
  recentStatusChecks: null,

  // Actions
  setRules: data => {
    set({ rules: data })
  },
  setPresetRuleData: data => {
    if (!data) {
      set({ presetRuleData: null })
      return
    }
    set({ presetRuleData: data })
  },
  setPrincipals: data => {
    if (!data) {
      set({ principals: null })
      return
    }
    set({ principals: data as PrincipalType[] })
  },
  setRecentStatusChecks: data => {
    if (!data) {
      set({ recentStatusChecks: null })
      return
    }
    set({ recentStatusChecks: data })
  }
}))
