import { ChangeEvent, useCallback, useState } from 'react'

import { Button, ListActions, NoData, PaginationComponent, SearchBox, SkeletonList, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'
import { debounce } from 'lodash-es'
import pluralize from 'pluralize'

import { MembersList } from './components/member-list'
import { InviteMemberDialog } from './components/new-member-dialog'
import { MembersProps, ProjectMemberListViewProps } from './types'

export const ProjectMemberListView: React.FC<ProjectMemberListViewProps> = ({
  isLoading,
  useTranslationStore,
  useMemberListStore,
  isInviteMemberDialogOpen,
  setIsInviteMemberDialogOpen,
  searchQuery,
  setSearchQuery
}) => {
  const { t } = useTranslationStore()
  const { memberList, totalPages, page, setPage } = useMemberListStore()
  const [searchInput, setSearchInput] = useState(searchQuery)

  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 300)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }, [])

  const renderListContent = () => {
    if (isLoading) return <SkeletonList />
    if (!memberList?.length) {
      if (searchQuery) {
        return (
          <NoData
            iconName="no-search-magnifying-glass"
            title={t('views:noData.noResults', 'No search results')}
            description={[
              t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
              t('views:noData.changeSearch', 'or search for a different keyword.')
            ]}
            primaryButton={{
              label: t('views:noData.clearSearch', 'Clear search'),
              onClick: () => {
                setSearchInput('')
                setSearchQuery(null)
              }
            }}
          />
        )
      }
      return (
        <NoData
          iconName="no-data-branches"
          title={t('views:noData.members')}
          description={[t('views:noData.inviteMembers')]}
          primaryButton={{
            label: t('views:projectSettings.newMember'),
            onClick: () => {}
          }}
        />
      )
    }
    return (
      <MembersList members={memberList} onEdit={(member: MembersProps) => {}} onDelete={(member: MembersProps) => {}} />
    )
  }

  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content maxWidth="3xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          {t('views:projectSettings.members')}
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root
              width="full"
              className="max-w-96"
              value={searchInput || ''}
              handleChange={handleInputChange}
              placeholder={t('views:repos.search')}
            />
          </ListActions.Left>
          <ListActions.Right>
            <Button
              variant="default"
              onClick={() => {
                setIsInviteMemberDialogOpen(true)
              }}
            >
              {t('views:projectSettings.newMember')}
            </Button>
          </ListActions.Right>
        </ListActions.Root>
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
      <InviteMemberDialog
        open={isInviteMemberDialogOpen}
        onClose={() => {
          setIsInviteMemberDialogOpen(false)
        }}
        onSubmit={() => {}}
        useTranslationStore={useTranslationStore}
        members={memberList}
        isLoadingMembers={isLoading}
      />
    </SandboxLayout.Main>
  )
}
