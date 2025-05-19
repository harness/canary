import { FC, useMemo } from 'react'

import { Button, ListActions, NoData, SearchBox, Spacer } from '@/components'
import { useDebounceSearch } from '@/hooks'
import { SandboxLayout } from '@/views'

import { InviteMemberDialog } from './components/invite-member-dialog'
import ProjectMembersList from './components/project-member-list'
import { ProjectMemberListViewProps } from './types'

export const ProjectMemberListView: FC<ProjectMemberListViewProps> = ({
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
  onEditMember,
  setPrincipalsSearchQuery,
  principalsSearchQuery,
  onDeleteHandler
}) => {
  const { t } = useTranslationStore()
  const { memberList, totalItems, pageSize, page, setPage } = useMemberListStore()
  const { principalList } = usePrincipalListStore()

  const { search, handleSearchChange, handleResetSearch } = useDebounceSearch({
    handleChangeSearchValue: (val: string) => setSearchQuery(val.length ? val : null),
    searchValue: searchQuery || ''
  })

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetFiltersQueryAndPages = () => {
    handleResetSearch()
    setPage(1)
  }

  return (
    <>
      {!memberList.length && !isDirtyList && !isLoading ? (
        <NoData
          textWrapperClassName="max-w-[350px]"
          iconName="no-data-members"
          title={t('views:noData.members', 'No members yet')}
          description={[
            t(
              'views:noData.inviteMembers',
              'There are no members in this project. Click on the button below to start adding them.'
            )
          ]}
          primaryButton={{
            label: t('views:projectSettings.inviteNewMember', 'Invite new member'),
            onClick: () => {
              setIsInviteMemberDialogOpen(true)
            }
          }}
        />
      ) : (
        <SandboxLayout.Main>
          <SandboxLayout.Content maxWidth="3xl">
            <h1 className="mb-6 text-2xl font-medium text-cn-foreground-1">
              {t('views:projectSettings.members', 'Member')}
            </h1>

            {(!!memberList.length || (!memberList.length && isDirtyList)) && (
              <>
                <ListActions.Root>
                  <ListActions.Left>
                    <SearchBox.Root
                      width="full"
                      className="max-w-96"
                      value={search}
                      handleChange={handleSearchChange}
                      placeholder={t('views:repos.search', 'Search')}
                    />
                  </ListActions.Left>
                  <ListActions.Right>
                    <Button
                      onClick={() => {
                        setIsInviteMemberDialogOpen(true)
                      }}
                    >
                      {t('views:projectSettings.newMember', 'New member')}
                    </Button>
                  </ListActions.Right>
                </ListActions.Root>

                <Spacer size={4.5} />
              </>
            )}

            <ProjectMembersList
              isLoading={isLoading}
              memberList={memberList}
              handleResetFiltersQueryAndPages={handleResetFiltersQueryAndPages}
              onDeleteHandler={onDeleteHandler}
              useTranslationStore={useTranslationStore}
              onEditMember={onEditMember}
              totalItems={totalItems}
              pageSize={pageSize}
              page={page}
              setPage={setPage}
            />
          </SandboxLayout.Content>
        </SandboxLayout.Main>
      )}

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
        setPrincipalsSearchQuery={setPrincipalsSearchQuery}
        principalsSearchQuery={principalsSearchQuery}
      />
    </>
  )
}
