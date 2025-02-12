import { useState } from 'react'

import { noop, useTranslationsStore } from '@utils/viewUtils'

import { DeleteAlertDialog } from '@harnessio/ui/components'
import { PrincipalType } from '@harnessio/ui/types'
import { ProjectMemberListView } from '@harnessio/ui/views'

const usePrincipalListStore = () => {
  return {
    principalList: [
      {
        uid: 'test1',
        display_name: 'Test 1',
        email: 'test@test.com',
        avatar_url: ''
      },
      {
        uid: 'test2',
        display_name: 'Test 2',
        email: 'test@test.io',
        avatar_url: ''
      }
    ],
    setPrincipalList: (_principals: PrincipalType[]) => {}
  }
}

const useMemberListStore = () => {
  return {
    memberList: [
      {
        display_name: 'Test 1',
        role: 'space_owner',
        email: 'test@test.com',
        avatarUrl: '',
        timestamp: '2 hours ago',
        uid: 'test1'
      },
      {
        display_name: 'Test 2',
        role: 'space_owner',
        email: 'test@test.io',
        avatarUrl: '',
        timestamp: 'Jan 14, 2025',
        uid: 'test2'
      }
    ],
    spaceId: '',
    page: 1,
    setPage: noop,
    totalPages: 10
  }
}

export const SpaceSettingsMembers = () => {
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')

  const handleSetDeleteMember = (id: string) => {
    setDeleteMemberId(id)
  }

  const handleResetDeleteMember = () => {
    setDeleteMemberId(null)
  }

  return (
    <>
      <ProjectMemberListView
        isLoading={false}
        useTranslationStore={useTranslationsStore}
        useMemberListStore={useMemberListStore}
        usePrincipalListStore={usePrincipalListStore}
        isInvitingMember={false}
        onSubmit={() => {}}
        onDeleteHandler={handleSetDeleteMember}
        isInviteMemberDialogOpen={isInviteDialogOpen}
        setIsInviteMemberDialogOpen={setIsInviteDialogOpen}
        searchQuery={null}
        setSearchQuery={() => {}}
        onEditMember={() => {}}
        setPrincipalsSearchQuery={setPrincipalsSearchQuery}
        principalsSearchQuery={principalsSearchQuery}
      />

      <DeleteAlertDialog
        open={deleteMemberId !== null}
        onClose={handleResetDeleteMember}
        deleteFn={() => {}}
        error={null}
        type="member"
        identifier={deleteMemberId ?? undefined}
        isLoading={false}
        useTranslationStore={useTranslationsStore}
        withForm
      />
    </>
  )
}
