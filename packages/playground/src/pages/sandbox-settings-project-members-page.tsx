import React, { useState } from 'react'
import { Spacer, Text, ListActions, SearchBox, Button } from '@harnessio/canary'
import { SandboxLayout, SkeletonList, NoData } from '..'
import { mockMemberData } from '../data/mockMembersData'
import { MembersList } from '../components/members-list'
import { PlaygroundListSettings } from '../settings/list-settings'
import { PaginationComponent } from '../components/pagination'
import { useNavigate } from 'react-router-dom'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

type MembersProps = {
  display_name: string
  role: string
  email: string
  avatarUrl?: string
  timestamp?: string
}

function SandboxSettingsProjectMembersPage() {
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState('data-loaded')

  const renderMemberListContent = () => {
    switch (loadState) {
      case 'loading':
        return <SkeletonList />
      case 'data-loaded':
        return <MembersList members={mockMemberData as MembersProps[]} />
      case 'no-search-matches':
        return (
          <>
            <Spacer size={10} />
            <NoData
              iconName="no-search-magnifying-glass"
              title="No search results"
              description={['Check your spelling and filter options,', 'or search for a different keyword.']}
              primaryButton={{ label: 'Clear search' }}
              secondaryButton={{ label: 'Clear filters' }}
            />
          </>
        )
    }
  }

  if (loadState === 'no-data') {
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
          <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
        </SandboxLayout.Content>
      </SandboxLayout.Main>
    )
  }

  const handleInviteClick = () => {
    navigate('/sandbox/settings/project/create-new-member')
  }

  return (
    <SandboxLayout.Main hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content maxWidth="3xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Team
        </Text>
        <Text size={5} weight={'medium'} color="tertiaryBackground">
          {loadState === 'data-loaded' || loadState === 'no-search-matches' ? ', 30 members' : ''}
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search Members" />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="All Team Roles" items={filterOptions} />
            <ListActions.Dropdown title="Last added" items={sortOptions} />
            <Button variant="default" onClick={handleInviteClick}>
              Invite New Members
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        {renderMemberListContent()}
        <Spacer size={8} />
        {loadState === 'data-loaded' && (
          <PaginationComponent
            totalPages={10}
            currentPage={5}
            nextPage={() => {}}
            previousPage={() => {}}
            handleClick={() => {}}
          />
        )}
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { SandboxSettingsProjectMembersPage }
