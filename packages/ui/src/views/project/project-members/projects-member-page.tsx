import { FC, useCallback, useMemo } from 'react'

import { Button, Dialog, ListActions, NoData, SearchInput, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'

import { InviteMemberDialog } from './components/invite-member-dialog'
import ProjectMembersList from './components/project-member-list'
import { ProjectMemberListViewProps } from './types'

export const ProjectMemberListView: FC<ProjectMemberListViewProps> = ({
  isLoading,
  isInvitingMember,
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
  const { t } = useTranslation()
  const { memberList, totalItems, pageSize, page, setPage } = useMemberListStore()
  const { principalList } = usePrincipalListStore()

  const handleSearchChange = useCallback(
    (val: string) => {
      setSearchQuery(val.length ? val : null)
    },
    [setSearchQuery]
  )

  const isDirtyList = useMemo(() => {
    return page !== 1 || !!searchQuery
  }, [page, searchQuery])

  const handleResetFiltersQueryAndPages = () => {
    setSearchQuery(null)
    setPage(1)
  }

  return (
    <>
      {!memberList.length && !isDirtyList && !isLoading ? (
        <NoData
          textWrapperClassName="max-w-[350px]"
          imageName="no-data-members"
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
            <Text as="h1" variant="heading-section" className="mb-cn-xl">
              {t('views:projectSettings.members', 'Member')}
            </Text>

            {(!!memberList.length || (!memberList.length && isDirtyList)) && (
              <>
                <ListActions.Root>
                  <ListActions.Left>
                    <SearchInput
                      id="search"
                      defaultValue={searchQuery ?? ''}
                      inputContainerClassName="w-80"
                      placeholder={t('views:repos.search', 'Search')}
                      onChange={handleSearchChange}
                      autoFocus
                    />
                  </ListActions.Left>
                  <ListActions.Right>
                    <Dialog.Trigger>
                      <Button
                        onClick={() => {
                          setIsInviteMemberDialogOpen(true)
                        }}
                      >
                        {t('views:projectSettings.newMember', 'New member')}
                      </Button>
                    </Dialog.Trigger>
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
        principals={principalList}
        isInvitingMember={isInvitingMember}
        error={inviteMemberError}
        setPrincipalsSearchQuery={setPrincipalsSearchQuery}
        principalsSearchQuery={principalsSearchQuery}
      />
    </>
  )
}
