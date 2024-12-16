export interface PrincipalData {
  display_name: string
  uid: string
}

export interface IPrincipalListStore {
  principalList: PrincipalData[]
  setPrincipals: (principals: PrincipalData[]) => void
}
