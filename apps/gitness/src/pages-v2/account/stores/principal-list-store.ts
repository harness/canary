import { create } from 'zustand'

import { IPrincipalListStore, PrincipalData } from '@harnessio/ui/views'

export const usePrincipalListStore = create<IPrincipalListStore>(
  (set: (partial: Partial<IPrincipalListStore>) => void) => ({
    principalList: [],
    setPrincipalList: (data: PrincipalData[]) =>
      set({
        principalList: data
      })
  })
)
