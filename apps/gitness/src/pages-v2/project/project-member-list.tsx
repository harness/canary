import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import {
  TypesPrincipalInfo,
  useListPrincipalsQuery,
  useMembershipAddMutation,
  useMembershipListQuery
} from '@harnessio/code-service-client'
import { InviteMemberFormFields, ProjectMemberListView } from '@harnessio/ui/views'

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

  const { isLoading, data: { body: membersData } = {} } = useMembershipListQuery({
    space_ref: space_ref ?? '',
    queryParams: {
      page,
      query: query ?? '',
      order: orderSortDate.DESC
    }
  })

  const {
    mutateAsync: inviteMember,
    isLoading: isInvitingMember,
    error: inviteMemberError
  } = useMembershipAddMutation({})

  const onSubmit = async (formValues: InviteMemberFormFields) => {
    const { member, role } = formValues

    await inviteMember({
      space_ref: space_ref ?? '',
      body: { role, user_uid: member }
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
          uid: member?.uid ?? ''
        }))
      )
    }
  }, [principalData, setPrincipalList])

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
    />
  )
}
