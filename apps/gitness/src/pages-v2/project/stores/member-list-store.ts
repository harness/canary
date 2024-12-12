import { create } from 'zustand'

import { MemberData } from '@harnessio/ui/views'

export interface IMemberListStore {
  // state
  memberData: MemberData[]
  spaceId: string
  totalPages: number
  page: number

  // actions
  setPage: (page: number) => void
}

export const useMemberListStore = create<IMemberListStore>(set => ({
  // initial state
  memberData: [],
  page: 1,
  spaceId: '',
  totalPages: 1,

  // Actions
  setPage: page => set({ page })
}))
