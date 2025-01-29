import { create } from 'zustand'

import { TypesMembershipUser } from '@harnessio/code-service-client'
import { MemberData } from '@harnessio/ui/views'

import { timeAgoFromEpochTime } from '../../../pages/pipeline-edit/utils/time-utils'

export interface IMemberListStore {
  // state
  memberList: MemberData[]
  spaceId: string
  totalPages: number
  page: number

  // actions
  setMemberList: (members: TypesMembershipUser[]) => void
  setPage: (page: number) => void
}

export const useMemberListStore = create<IMemberListStore>(set => ({
  // initial state
  memberList: [],
  page: 1,
  spaceId: '',
  totalPages: 1,

  // Actions
  setMemberList: members =>
    set({
      memberList: members.map((member: TypesMembershipUser) => ({
        display_name: member.principal?.display_name ?? '',
        role: member.role ?? '',
        email: member.principal?.email ?? '',
        avatarUrl: '',
        timestamp: member.created ? timeAgoFromEpochTime(member.created) : 'No time available',
        uid: member.principal?.uid ?? ''
      }))
    }),
  setPage: page => set({ page })
}))
