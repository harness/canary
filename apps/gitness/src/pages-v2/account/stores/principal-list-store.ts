import { create } from 'zustand'

import { TypesPrincipalInfo } from '@harnessio/code-service-client'
import { PrincipalData } from '@harnessio/ui/views'

export interface IPrincipalListStore {
  // state
  principalList: PrincipalData[]
  // actions
  setPrincipalList: (principals: TypesPrincipalInfo[]) => void
}

export const usePrincipalListStore = create<IPrincipalListStore>(set => ({
  // initial state
  principalList: [],

  // Actions
  setPrincipalList: principals =>
    set({
      principalList: principals.map((member: TypesPrincipalInfo) => ({
        display_name: member?.display_name ?? '',
        uid: member?.uid ?? ''
      }))
    })
}))
