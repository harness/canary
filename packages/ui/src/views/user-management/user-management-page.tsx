import { Button, ListActions, Pagination, SearchBox, Spacer, Text } from '@/components'
import { SandboxLayout } from '@/views'

import { UsersList } from './components/users-list'
import { DialogLabels, IUserManagementPageProps, UsersProps } from './types'

export const UserManagementPage: React.FC<IUserManagementPageProps> = ({
  useAdminListUsersStore,
  useTranslationStore,
  handleDialogOpen
}) => {
  const { users: userData, totalPages, page: currentPage, setPage } = useAdminListUsersStore()
  const { t } = useTranslationStore()

  const renderUserListContent = () => {
    return (
      <>
        <UsersList users={userData as UsersProps[]} handleDialogOpen={handleDialogOpen} />
      </>
    )
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content maxWidth="3xl">
        <Spacer size={10} />
        <Text size={5} weight={'medium'}>
          Users
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root width="full" className="max-w-96" placeholder="search" />
          </ListActions.Left>
          <ListActions.Right>
            <Button variant="default" onClick={() => handleDialogOpen(null, DialogLabels.CREATE_USER)}>
              New user
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        {renderUserListContent()}
        <Spacer size={8} />
        <Pagination totalPages={totalPages} currentPage={currentPage} goToPage={setPage} t={t} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
