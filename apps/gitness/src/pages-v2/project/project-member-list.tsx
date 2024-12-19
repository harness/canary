import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
  EnumMembershipRole,
  TypesPrincipalInfo,
  useListPrincipalsQuery,
  useMembershipAddMutation,
  useMembershipListQuery,
  useMembershipUpdateMutation
} from '@harnessio/code-service-client'
import { InviteMemberFormFields, MembersProps, ProjectMemberListView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { orderSortDate } from '../../types'
import { usePrincipalListStore } from '../account/stores/principal-list-store'
import { useMemberListStore } from './stores/member-list-store'

export function ProjectMemberListPage() {
  const space_ref = useGetSpaceURLParam()
  const { page, setPage, setMemberList } = useMemberListStore()
  const { setPrincipalList } = usePrincipalListStore()
  const queryClient = useQueryClient()

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const [query, setQuery] = useQueryState('query')
  const [queryPage, setQueryPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const { data: { body: principalData } = {} } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemnted
    queryParams: { page: 1, limit: 100, type: 'user' }
  })

  const {
    isLoading,
    data: { body: membersData } = {},
    refetch
  } = useMembershipListQuery({
    space_ref: space_ref ?? '',
    queryParams: {
      page,
      query: query ?? '',
      order: orderSortDate.DESC
    }
  })

  const { mutateAsync: updateRole } = useMembershipUpdateMutation(
    { space_ref },
    {
      onError: _error => {
        /**
         * Ignore error
         * No error handling design spec available yet
         * @TODO fix when available
         */
      }
    }
  )

  const mapToEnumMembershipRole = (role: string): EnumMembershipRole | undefined =>
    (['contributor', 'executor', 'reader', 'space_owner'] as const).includes(role as EnumMembershipRole)
      ? (role as EnumMembershipRole)
      : undefined

  const {
    mutateAsync: inviteMember,
    isLoading: isInvitingMember,
    error: inviteMemberError
  } = useMembershipAddMutation({})

  const onSubmit = async (formValues: InviteMemberFormFields) => {
    const { member, role } = formValues

    await inviteMember({
      space_ref: space_ref ?? '',
      body: { role: mapToEnumMembershipRole(role), user_uid: member }
    })
    queryClient.invalidateQueries({ queryKey: ['membershipList'] })
    setIsDialogOpen(false)
  }

  useEffect(() => {
    setQueryPage(page)
  }, [page, setPage, queryPage])

  useEffect(() => {
    if (membersData) {
      setMemberList(membersData)
    }
  }, [membersData, setMemberList])

  useEffect(() => {
    if (principalData) {
      setPrincipalList(
        principalData.map((member: TypesPrincipalInfo) => ({
          display_name: member?.display_name ?? '',
          uid: member?.uid ?? '',
          email: member?.email ?? '',
          avatar_url: ''
        }))
      )
    }
  }, [principalData, setPrincipalList])

  const handleRoleChange = async (user_uid: string, newRole: EnumMembershipRole): Promise<void> => {
    const owners = membersData?.filter(member => (member.role as EnumMembershipRole) === 'space_owner') ?? []
    const isOnlyOwner = owners.length === 1
    const isCurrentUserOwner = owners.some(member => member.principal?.uid === user_uid)

    // Check if the current user is the only owner and is trying to change their role
    if (isOnlyOwner && isCurrentUserOwner && newRole !== 'space_owner') {
      alert('Cannot change role. At least one owner is required.')
      return
    }

    await updateRole({ user_uid, body: { role: newRole } })
    refetch()
  }

  return (
    <ProjectMemberListView
      isLoading={isLoading}
      useTranslationStore={useTranslationStore}
      useMemberListStore={useMemberListStore}
      usePrincipalListStore={usePrincipalListStore}
      isInvitingMember={isInvitingMember}
      inviteMemberError={inviteMemberError?.message}
      onSubmit={onSubmit}
      isInviteMemberDialogOpen={isDialogOpen}
      setIsInviteMemberDialogOpen={setIsDialogOpen}
      searchQuery={query}
      setSearchQuery={setQuery}
      onEditMember={(member: MembersProps) => {
        const mappedRole = mapToEnumMembershipRole(member.role)
        if (mappedRole) {
          handleRoleChange(member.uid, mappedRole)
        }
      }}
    />
  )
}
