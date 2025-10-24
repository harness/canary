export interface MemberData {
  display_name: string
  role: string
  email: string
  avatarUrl: string
  timestamp: string
  uid: string
}

export interface TypesSpace {
  created?: number
  created_by?: number
  deleted?: number | null
  description?: string
  id?: number
  identifier?: string
  parent_id?: number
  path?: string
  updated?: number
}

export interface IMemberListStore {
  memberList: MemberData[]
  spaceId: string
  totalPages: number
  page: number
  setPage: (page: number) => void
}
