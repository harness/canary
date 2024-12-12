export interface MemberData {
  principal: {
    display_name: string
    uid: string
  }
  role: string
  added_by: { email: string }
  created: number
}

export interface IMemberListStore {
  // state
  memberData: MemberData[]
  spaceId: string
  totalPages: number
  page: number

  // actions
  setPage: (page: number) => void
}
