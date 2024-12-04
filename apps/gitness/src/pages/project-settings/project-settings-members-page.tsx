import { useState } from 'react'
import { Link } from 'react-router-dom'

import { parseAsInteger, useQueryState } from 'nuqs'
import pluralize from 'pluralize'

import { Button, Spacer, Text } from '@harnessio/canary'
import {
  EnumMembershipRole,
  MembershipListQueryQueryParams,
  TypesMembershipUser,
  useMembershipDeleteMutation,
  useMembershipListQuery,
  useMembershipUpdateMutation
} from '@harnessio/code-service-client'
import { SkeletonList } from '@harnessio/ui/components'
import {
  Filter,
  FormDeleteMemberDialog,
  MembersList,
  MembersProps,
  NoData,
  NoSearchResults,
  PaginationComponent,
  SandboxLayout,
  useCommonFilter
} from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useDebouncedQueryState } from '../../hooks/useDebouncedQueryState'
import { PageResponseHeader } from '../../types'
import { timeAgoFromEpochTime } from '../pipeline-edit/utils/time-utils'
import { DialogState } from './types'

const SortOptions = [
  { name: 'Name', value: 'name' },
  { name: 'Created', value: 'created' }
]

const ProjectSettingsMemebersPage = () => {
  const space_ref = useGetSpaceURLParam()
  const [dialogState, setDialogState] = useState<DialogState>({
    isDialogDeleteOpen: false,
    selectedMember: null
  })
  const { sort } = useCommonFilter<MembershipListQueryQueryParams['sort']>()
  const [query, setQuery] = useDebouncedQueryState('query')
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const {
    isLoading,
    data: { body: membersData, headers } = {},
    refetch
  } = useMembershipListQuery({
    space_ref: space_ref ?? '',
    queryParams: {
      query,
      order: 'asc',
      sort,
      page
    }
  })

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  // edit api call
  const { mutateAsync: updateRole } = useMembershipUpdateMutation(
    { space_ref },
    {
      onError: error => {
        //no design nere
        alert('Error updating membership role: ' + error.message)
      }
    }
  )

  // delete api call
  const {
    isLoading: deleteLoading,
    mutateAsync: deleteMember,
    isSuccess: deleteSuccess
  } = useMembershipDeleteMutation(
    { space_ref: space_ref, user_uid: dialogState.selectedMember?.uid ?? '' },
    {
      onError: error => {
        //no design here
        alert('Error deleting membership role: ' + error.message)
      }
    }
  )

  const handleDelete = async () => {
    if (dialogState.selectedMember?.uid) {
      await deleteMember({ user_uid: dialogState.selectedMember.uid })
      refetch()
      setDialogState(prev => ({
        ...prev,
        isDialogDeleteOpen: false,
        selectedMember: null
      }))
    }
  }

  const handleRoleChange = async (user_uid: string, newRole: EnumMembershipRole) => {
    const owners = membersData?.filter(member => (member.role as EnumMembershipRole) === 'space_owner') ?? []
    const isOnlyOwner = owners.length === 1
    const isCurrentUserOwner = owners.some(member => member.principal?.uid === user_uid)

    // Check if the current user is the only owner and is trying to change their role
    if (isOnlyOwner && isCurrentUserOwner && newRole !== 'space_owner') {
      alert('Cannot change role. At least one owner is required.')
      return
    }

    // Proceed with the role change if validation passes
    await updateRole({ user_uid, body: { role: newRole } })
    refetch()
  }

  const renderMemberListContent = () => {
    if (isLoading) return <SkeletonList />
    if (!membersData?.length) {
      if (query) {
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search', onClick: () => setQuery('') }}
          />
        )
      }
      return (
        <NoData
          iconName="no-data-members"
          title="No Members yet"
          description={['Add your first team members by inviting them to join this project.']}
          primaryButton={{ label: 'Invite new members' }}
        />
      )
    }
    return (
      <>
        <MembersList
          members={membersData.map((member: TypesMembershipUser) => ({
            display_name: member.principal?.display_name ?? '',
            role: member.role === 'space_owner' ? 'Owner' : (member.role ?? ''), // Ensure role is always a string
            email: member.added_by?.email ?? '',
            avatarUrl: '',
            timestamp: member.created ? timeAgoFromEpochTime(member.created) : 'No time available',
            uid: member.principal?.uid ?? ''
          }))}
          onEdit={(member: MembersProps) => handleRoleChange(member.uid, member.role as EnumMembershipRole)}
          onDelete={(member: MembersProps) =>
            setDialogState({
              ...dialogState,
              isDialogDeleteOpen: true,
              selectedMember: member
            })
          }
        />
        {dialogState.isDialogDeleteOpen && dialogState.selectedMember && (
          <FormDeleteMemberDialog
            isDeleting={deleteLoading}
            deleteSuccess={deleteSuccess}
            member={{
              ...dialogState.selectedMember,
              email: dialogState.selectedMember.email,
              uid: dialogState.selectedMember.uid // Add the 'uid' property
            }}
            onDelete={handleDelete}
            onClose={() => setDialogState(prev => ({ ...prev, isDialogDeleteOpen: false }))}
          />
        )}
      </>
    )
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="3xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Team
        </Text>
        <Text size={5} weight={'medium'} color="tertiaryBackground">
          {membersData?.length ? `, ${membersData.length} ${pluralize('member', membersData.length)}` : ''}
        </Text>
        <Spacer size={6} />
        <div className="flex justify-between gap-5">
          <div className="flex-1">
            <Filter sortOptions={SortOptions} />
          </div>
          <Button variant="default" asChild>
            <Link to={`/spaces/${space_ref}/settings/members/create`}>Invite New Members</Link>
          </Button>
        </div>
        <Spacer size={5} />
        {renderMemberListContent()}
        <Spacer size={8} />
        {totalPages > 1 && (
          <PaginationComponent
            totalPages={totalPages}
            currentPage={page}
            goToPage={(pageNum: number) => setPage(pageNum)}
          />
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ProjectSettingsMemebersPage }
