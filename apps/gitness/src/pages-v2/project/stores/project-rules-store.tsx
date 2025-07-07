import { create } from 'zustand'

import { PrincipalType } from '@harnessio/ui/types'
import { IProjectRulesStore } from '@harnessio/ui/views'

import { PageResponseHeader } from '../../../types'

export const useProjectRulesStore = create<IProjectRulesStore>(set => ({
  // Initial state

  presetRuleData: null,
  rules: null,
  principals: null,
  recentStatusChecks: null,
  totalItems: 0,
  pageSize: 10,

  // Actions
  setRules: (data, headers) => {
    const totalItems = parseInt(headers?.get(PageResponseHeader.xTotal) || '0')
    const pageSize = parseInt(headers?.get(PageResponseHeader.xPerPage) || '10')
    set({ rules: data, totalItems, pageSize })
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
