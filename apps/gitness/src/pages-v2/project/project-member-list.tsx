import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import {
  EnumMembershipRole,
  useListPrincipalsQuery,
  useMembershipAddMutation,
  useMembershipDeleteMutation,
  useMembershipListQuery,
  useMembershipUpdateMutation
} from '@harnessio/code-service-client'
import { DeleteAlertDialog } from '@harnessio/ui/components'
import { PrincipalType } from '@harnessio/ui/types'
import { InviteMemberFormFields, MembersProps, ProjectMemberListView } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useQueryState } from '../../framework/hooks/useQueryState'
import usePaginationQueryStateWithStore from '../../hooks/use-pagination-query-state-with-store'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { orderSortDate, PageResponseHeader } from '../../types'
import { usePrincipalListStore } from '../account/stores/principal-list-store'
import { useMemberListStore } from './stores/member-list-store'

const mapToEnumMembershipRole = (role: string): EnumMembershipRole | undefined =>
  (['contributor', 'executor', 'reader', 'space_owner'] as const).includes(role as EnumMembershipRole)
    ? (role as EnumMembershipRole)
    : undefined

export function ProjectMemberListPage() {
  const spaceURL = useGetSpaceURLParam()
  const { page, setPage, setMemberList } = useMemberListStore()
  const { setPrincipalList } = usePrincipalListStore()
  const queryClient = useQueryClient()
  const [query, setQuery] = useQueryState('query')
  const {
    scope: { accountId }
  } = useMFEContext()

  const [principalsSearchQuery, setPrincipalsSearchQuery] = useState('')
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null)

  const { queryPage } = usePaginationQueryStateWithStore({ page, setPage })

  const { data: { body: principalData } = {} } = useListPrincipalsQuery({
    // @ts-expect-error : BE issue - not implemented
    queryParams: { page: 1, limit: 100, type: 'user', query: principalsSearchQuery, accountIdentifier: accountId }
  })

  const { isLoading, data: { body: membersData, headers } = {} } = useMembershipListQuery({
    space_ref: spaceURL ?? '',
    queryParams: {
      page: queryPage,
      query: query ?? '',
      order: orderSortDate.DESC
    }
  })

  const { mutateAsync: updateRole } = useMembershipUpdateMutation({
    space_ref: spaceURL ?? ''
  })

  /**
   * Close dialog for Delete member and if it was API error - reset it
   */
  const handleResetDeleteMember = () => {
    setDeleteMemberId(null)
    if (deleteMemberError) {
      resetDeleteMember()
    }
  }

  const handleSetDeleteMember = (id: string) => {
    setDeleteMemberId(id)
  }

  const {
    mutate: deleteMember,
    isLoading: isDeletingMember,
    error: deleteMemberError,
    reset: resetDeleteMember
  } = useMembershipDeleteMutation(
    { space_ref: spaceURL ?? '' },
    {
      onSuccess: () => {
        handleResetDeleteMember()
        handleInvalidateMemberList()
      }
    }
  )

  const {
    mutateAsync: inviteMember,
    isLoading: isInvitingMember,
    error: inviteMemberError,
    reset
  } = useMembershipAddMutation({
    space_ref: spaceURL ?? ''
  })

  const handleDeleteMember = (user_uid: string) => {
    deleteMember({ user_uid })
  }

  const handleInvalidateMemberList = () => {
    queryClient.invalidateQueries({ queryKey: ['membershipList'] })
  }

  /**
   * - Reset principalsSearchQuery to empty state, need to trigger fetch useListPrincipalsQuery with no search state.
   * - Reset useMembershipAddMutation
   */
  useEffect(() => {
    if (!isInviteDialogOpen) {
      reset()

      if (principalsSearchQuery.length) setPrincipalsSearchQuery('')
    }
  }, [isInviteDialogOpen, principalsSearchQuery, reset])

  /**
   * Submit form of inviting member
   * - invalidate members list query
   * - close dialog
   */
  const onSubmit = async (formValues: InviteMemberFormFields) => {
    const { member, role } = formValues

    await inviteMember({
      space_ref: spaceURL ?? '',
      body: { role: mapToEnumMembershipRole(role), user_uid: member }
    })
    handleInvalidateMemberList()
    setIsInviteDialogOpen(false)
  }

  useEffect(() => {
    if (membersData) {
      const totalItems = parseInt(headers?.get(PageResponseHeader.xTotal) ?? '0')
      const pageSize = parseInt(headers?.get(PageResponseHeader.xPerPage) ?? '10')
      setMemberList(membersData, { totalItems, pageSize })
    }
  }, [membersData, setMemberList, headers])

  useEffect(() => {
    if (principalData) {
      setPrincipalList(principalData as PrincipalType[])
    }
  }, [principalData, setPrincipalList])

  /**
   * Handle to change member role
   * TODO: This check for a single user with the space_owner role is not accurate because the list is paginated, and it does not include all users.
   * TODO: In this case, the check should be performed on the backend, returning an error when the request is made.
   */
  const handleRoleChange = async (user_uid: string, newRole: EnumMembershipRole): Promise<void> => {
    const owners = membersData?.filter(member => (member.role as EnumMembershipRole) === 'space_owner') ?? []
    const isOnlyOwner = owners.length === 1
    const isCurrentUserOwner = owners.some(member => member.principal?.uid === user_uid)

    if (isOnlyOwner && isCurrentUserOwner && newRole !== 'space_owner') {
      alert('Cannot change role. At least one owner is required.')
      return
    }

    await updateRole({ user_uid, body: { role: newRole } })
    handleInvalidateMemberList()
  }

  const handleOnEditMember = (member: MembersProps) => {
    const mappedRole = mapToEnumMembershipRole(member.role)
    if (mappedRole) {
      handleRoleChange(member.uid, mappedRole)
    }
  }

  return (
    <>
      <ProjectMemberListView
        isLoading={isLoading}
        useTranslationStore={useTranslationStore}
        useMemberListStore={useMemberListStore}
        usePrincipalListStore={usePrincipalListStore}
        isInvitingMember={isInvitingMember}
        inviteMemberError={inviteMemberError?.message}
        onSubmit={onSubmit}
        onDeleteHandler={handleSetDeleteMember}
        isInviteMemberDialogOpen={isInviteDialogOpen}
        setIsInviteMemberDialogOpen={setIsInviteDialogOpen}
        searchQuery={query}
        setSearchQuery={setQuery}
        onEditMember={handleOnEditMember}
        setPrincipalsSearchQuery={setPrincipalsSearchQuery}
        principalsSearchQuery={principalsSearchQuery}
      />

      <DeleteAlertDialog
        open={deleteMemberId !== null}
        onClose={handleResetDeleteMember}
        deleteFn={handleDeleteMember}
        error={deleteMemberError ? { message: deleteMemberError?.message ?? '' } : null}
        type="member"
        identifier={deleteMemberId ?? undefined}
        isLoading={isDeletingMember}
        useTranslationStore={useTranslationStore}
        withForm
      />
    </>
  )
}
