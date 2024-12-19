import { create } from 'zustand'

import { IPrincipalListStore, PrincipalData } from '@harnessio/ui/views'

export const usePrincipalListStore = create<IPrincipalListStore>(
  (set: (partial: Partial<IPrincipalListStore>) => void) => ({
    // initial state
    principalList: [],

    // Actions
    setPrincipalList: (principals: PrincipalData[]) =>
      set({
        principalList: principals
      })
  })
)
