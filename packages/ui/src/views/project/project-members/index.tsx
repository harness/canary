import { NoData, PaginationComponent, SkeletonList, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'
import pluralize from 'pluralize'

import { MemberData } from '../project.types'
import { MembersList } from './components/member-list'
import { MembersProps, ProjectMemberListViewProps } from './types'

export const ProjectMemberListView: React.FC<ProjectMemberListViewProps> = ({
  isLoading,
  useTranslationStore,
  useMemberListStore,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslationStore()
  const { memberData, totalPages, page, setPage } = useMemberListStore()
  const renderListContent = () => {
    if (isLoading) return <SkeletonList />
    if (!memberData?.length) {
      if (searchQuery) {
        return (
          <NoData
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search', onClick: () => setSearchQuery('') }}
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
          members={memberData.map((member: MemberData) => ({
            display_name: 'sample',
            role: member.role === 'space_owner' ? 'Owner' : (member.role ?? ''), // Ensure role is always a string
            email: member.added_by.email,
            avatarUrl: '',
            timestamp: '',
            uid: member.principal.uid
          }))}
          onEdit={(member: MembersProps) => {}}
          onDelete={(member: MembersProps) => {}}
        />
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
          {memberData?.length ? `, ${memberData.length} ${pluralize('member', memberData.length)}` : ''}
        </Text>
        <Spacer size={6} />
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        <PaginationComponent
          totalPages={totalPages}
          currentPage={page}
          goToPage={(pageNum: number) => setPage(pageNum)}
          t={t}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
