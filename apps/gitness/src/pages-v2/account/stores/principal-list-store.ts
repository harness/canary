import { create } from 'zustand'

import { PrincipalType } from '@harnessio/ui/types'
import { IPrincipalListStore } from '@harnessio/ui/views'

export const usePrincipalListStore = create<IPrincipalListStore>(
  (set: (partial: Partial<IPrincipalListStore>) => void) => ({
    principalList: [],
    setPrincipalList: (data: PrincipalType[]) =>
      set({
        principalList: data
      })
  })
)
