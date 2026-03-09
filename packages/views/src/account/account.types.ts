import { PrincipalType } from '@harnessio/ui/types'

export interface IPrincipalListStore {
  // state
  principalList: PrincipalType[]
  // actions
  setPrincipalList: (principals: PrincipalType[]) => void
}
