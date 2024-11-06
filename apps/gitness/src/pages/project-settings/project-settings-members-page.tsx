import { useState, useCallback } from 'react'
import { Spacer, Text, ListActions, SearchBox, Button, Alert } from '@harnessio/canary'
import debounce from 'lodash-es/debounce'

import {
  SandboxLayout,
  SkeletonList,
  NoData,
  MembersList,
  FormDeleteMemberDialog,
  useCommonFilter,
  PaginationComponent,
  Filter
} from '@harnessio/playground'
import {
  useMembershipListQuery,
  TypesMembershipUser,
  EnumMembershipRole,
  MembershipListQueryQueryParams,
  useMembershipUpdateMutation,
  useMembershipDeleteMutation
} from '@harnessio/code-service-client'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { Link } from 'react-router-dom'
import { timeAgoFromEpochTime } from '../pipeline-edit/utils/time-utils'
import { useQueryState, parseAsInteger } from 'nuqs'
import { PageResponseHeader } from '../../types'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const SortOptions = [
  { name: 'Name', value: 'name' },
  { name: 'Created', value: 'created' }
]

const ProjectSettingsMemebersPage = () => {
  const space_ref = useGetSpaceURLParam()

  //state management
  const [totalMembers, setTotalMembers] = useState<number | null>(null)
  const [members, setMembers] = useState<TypesMembershipUser[]>([]) // unified state for members
  const [dialogState, setDialogState] = useState({
    isDialogEditOpen: false,
    isDialogDeleteOpen: false,
    selectedMember: null as {
      display_name: string
      role: string
      email: string
      uid: string
    } | null
  })

  const { sort, query: currentQuery } = useCommonFilter<MembershipListQueryQueryParams['sort']>()
  const [query, setQuery] = useQueryState('query', {
    defaultValue: currentQuery || ''
  })
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  const [apiError, setApiError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState(query) // not used

  // Define the query parameters for useMembershipListQuery
  const queryParams: MembershipListQueryQueryParams = {
    query,
    order: 'asc',
    sort: sortMember,
    page,
    limit: 30
  }

  const {
    isLoading,
    data: { headers } = {},
    refetch
  } = useMembershipListQuery(
    { space_ref: space_ref ?? '', queryParams: queryParams },
    {
      onSuccess: ({ body: membersData }) => {
        setMembers(membersData) // Update members state
        setTotalMembers(membersData.length) // Update total members count
      }
    }
  )

  const totalPages = parseInt(headers?.get(PageResponseHeader.xTotalPages) || '')

  // edit api call
  const { mutate: updateRole } = useMembershipUpdateMutation(
    { space_ref },
    {
      onSuccess: () => {
        refetch()
      },
      onError: error => {
        //no design nere
        alert('Error updating membership role: ' + error.message)
      }
    }
  )

  // delete api call
  const {
    isLoading: deleteLoading,
    mutate: deleteMember,
    isSuccess: deleteSuccess
  } = useMembershipDeleteMutation(
    { space_ref: space_ref, user_uid: dialogState.selectedMember?.uid ?? '' },
    {
      onSuccess: () => {
        refetch()
        setDialogState(prev => ({
          ...prev,
          isDialogDeleteOpen: false,
          selectedMember: null
        })) // Close dialog on success
      },
      onError: error => {
        //no design here
        alert('Error deleting membership role: ' + error.message)
      }
    }
  )

  const handleDelete = () => {
    if (dialogState.selectedMember?.uid) {
      deleteMember({ user_uid: dialogState.selectedMember.uid })
    }
  }

  const handleRoleChange = (user_uid: string, newRole: EnumMembershipRole) => {
    const owners = members.filter(member => (member.role as EnumMembershipRole) === 'space_owner')
    const isOnlyOwner = owners.length === 1
    const isCurrentUserOwner = owners.some(member => member.principal?.uid === user_uid)

    // Check if the current user is the only owner and is trying to change their role
    if (isOnlyOwner && isCurrentUserOwner && newRole !== 'space_owner') {
      setApiError('Cannot change role. At least one owner is required.')
      return
    }

    // Proceed with the role change if validation passes
    updateRole({ user_uid, body: { role: newRole } })
  }

  // Debounce the search term change to avoid frequent updates
  const debouncedSetQuery = useCallback(
    debounce(term => setQuery(term), 300), // 300 ms debounce delay
    [setQuery]
  )

  // Update search term on input change and debounce the API call
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = event.target.value
    setSearchTerm(newTerm)
    debouncedSetQuery(newTerm)
  }

  //sort api integration
  const handleSortChange = (newSort: string) => {
    setSortMember(newSort as MembershipListQueryQueryParams['sort'])
    refetch()
  }

  const renderMemberListContent = () => {
    if (isLoading) return <SkeletonList />
    if (!members?.length) {
      if (query) {
        return (
          <NoData
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
          />
        )
      }
      return (
        //add this layout to target the content in the center of the page without header and subheader
        <SandboxLayout.Main hasLeftPanel>
          <SandboxLayout.Content maxWidth="3xl" className="h-screen">
            <NoData
              iconName="no-data-members"
              title="No Members yet"
              description={['Add your first team members by inviting them to join this project.']}
              primaryButton={{ label: 'Invite new members' }}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      )
    }
    return (
      <>
        <MembersList
          members={members.map((member: TypesMembershipUser) => ({
            display_name: member.principal?.display_name ?? '',
            role: member.role === 'space_owner' ? 'Owner' : (member.role ?? ''), // Ensure role is always a string
            email: member.added_by?.email ?? '',
            avatarUrl: '',
            timestamp: member.created ? timeAgoFromEpochTime(member.created) : 'No time available',
            uid: member.principal?.uid ?? ''
          }))}
          onEdit={member => handleRoleChange(member.uid, member.role as EnumMembershipRole)}
          onDelete={member =>
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
        {apiError && <Alert className="">{apiError}</Alert>}
        <Text size={5} weight={'medium'}>
          Team
        </Text>
        <Text size={5} weight={'medium'} color="tertiaryBackground">
          , {totalMembers ? `${totalMembers} members` : ''}
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search Members" handleChange={handleInputChange} defaultValue={searchTerm} />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="All Team Roles" items={filterOptions} />
            <Filter showSearch={false} sortOptions={SortOptions} />
            <Link to={`/${space_ref}/sandbox/settings/project/create-new-member`}>
              <Button variant="default">Invite New Members</Button>
            </Link>
          </ListActions.Right>
        </ListActions.Root>
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
