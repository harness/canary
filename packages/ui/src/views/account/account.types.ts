import { PrincipalType } from '@/types'

export interface IPrincipalListStore {
  // state
  principalList: PrincipalType[]
  // actions
  setPrincipalList: (principals: PrincipalType[]) => void
}
