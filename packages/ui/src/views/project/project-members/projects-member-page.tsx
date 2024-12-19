import { ChangeEvent, useCallback, useState } from 'react'

import { Button, ListActions, PaginationComponent, SearchBox, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'
import { debounce } from 'lodash-es'

import { InviteMemberDialog } from './components/invite-member-dialog'
import ProjectMembersList from './components/project-member-list'
import { ProjectMemberListViewProps } from './types'

export const ProjectMemberListView: React.FC<ProjectMemberListViewProps> = ({
  isLoading,
  isInvitingMember,
  useTranslationStore,
  useMemberListStore,
  usePrincipalListStore,
  isInviteMemberDialogOpen,
  setIsInviteMemberDialogOpen,
  inviteMemberError,
  searchQuery,
  setSearchQuery,
  onSubmit,
  onEditMember
}) => {
  const { t } = useTranslationStore()
  const { memberList, totalPages, page, setPage } = useMemberListStore()
  const { principalList } = usePrincipalListStore()
  const [searchInput, setSearchInput] = useState(searchQuery)

  const debouncedSetSearchQuery = debounce(searchQuery => {
    setSearchQuery(searchQuery || null)
  }, 300)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    debouncedSetSearchQuery(e.target.value)
  }, [])

  return (
    <SandboxLayout.Main>
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
        <ProjectMembersList
          isLoading={isLoading}
          memberList={memberList}
          searchQuery={searchQuery}
          useTranslationStore={useTranslationStore}
          setSearchInput={setSearchInput}
          setSearchQuery={setSearchQuery}
          setIsInviteMemberDialogOpen={setIsInviteMemberDialogOpen}
          onEditMember={onEditMember}
        />
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
        onSubmit={onSubmit}
        useTranslationStore={useTranslationStore}
        principals={principalList}
        isInvitingMember={isInvitingMember}
        error={inviteMemberError}
      />
    </SandboxLayout.Main>
  )
}
