export interface PrincipalData {
  display_name: string
  uid: string
  email: string
  avatar_url: string
}

export interface IPrincipalListStore {
  // state
  principalList: PrincipalData[]
  // actions
  setPrincipalList: (principals: PrincipalData[]) => void
}
