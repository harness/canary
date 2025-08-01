import { Pagination, Spacer, Text } from '@/components'
import { useTranslation } from '@/context'
import { SandboxLayout } from '@/views'
import { EmptyState } from '@/views/user-management/components/empty-state/empty-state'
import { Actions } from '@/views/user-management/components/page-components/actions'
import { UsersList } from '@/views/user-management/components/page-components/content/components/users-list'
import { ContentProps } from '@/views/user-management/components/page-components/content/types'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

export const Content = ({ totalItems, pageSize, currentPage, setPage }: ContentProps) => {
  const { useAdminListUsersStore } = useUserManagementStore()

  const { users } = useAdminListUsersStore()

  const { loadingStates } = useStates()
  const { isFetchingUsers } = loadingStates

  const { t } = useTranslation()

  if (!isFetchingUsers && !users?.length) {
    return <EmptyState />
  }

  return (
    <SandboxLayout.Content>
      <Text as="h1" variant="heading-section">
        {t('views:userManagement.usersHeader', 'Users')} <Text as="span">({users?.length || 0})</Text>
      </Text>
      <Spacer size={6} />
      <Actions />
      <Spacer size={4.5} />
      <UsersList />
      <Pagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        goToPage={(pageNum: number) => setPage(pageNum)}
      />
    </SandboxLayout.Content>
  )
}
