export interface MemberData {
  display_name: string
  role: string
  email: string
  avatarUrl: string
  timestamp: string
  uid: string
}

export interface IMemberListStore {
  // state
  memberList: MemberData[]
  spaceId: string
  totalPages: number
  page: number

  // actions
  setPage: (page: number) => void
}
