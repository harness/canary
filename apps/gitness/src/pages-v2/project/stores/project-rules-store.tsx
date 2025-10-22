import { create } from 'zustand'

import { PrincipalType, TypesUserGroupInfo } from '@harnessio/ui/types'
import { IProjectRulesStore } from '@harnessio/ui/views'

import { PageResponseHeader } from '../../../types'

export const useProjectRulesStore = create<IProjectRulesStore>(set => ({
  // Initial state

  presetRuleData: null,
  rules: null,
  principals: null,
  userGroups: null,
  recentStatusChecks: null,
  totalItems: 0,
  page: 1,
  pageSize: 10,

  // Actions
  setPage: page => set({ page }),
  setPageSize: (pageSize: number) => set({ pageSize, page: 1 }),
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
  setUserGroups: data => {
    if (!data) {
      set({ userGroups: null })
      return
    }
    set({ userGroups: data as TypesUserGroupInfo[] })
  },
  setRecentStatusChecks: data => {
    if (!data) {
      set({ recentStatusChecks: null })
      return
    }
    set({ recentStatusChecks: data })
  }
}))
