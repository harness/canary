import { Pagination, Spacer } from '@/components'
import { SandboxLayout } from '@/views'
import { EmptyState } from '@/views/user-management/components/empty-state/empty-state'
import { Actions } from '@/views/user-management/components/page-components/actions'
import { UsersList } from '@/views/user-management/components/page-components/content/components/users-list'
import { ContentProps } from '@/views/user-management/components/page-components/content/types'
import { useStates } from '@/views/user-management/providers/state-provider'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

export const Content = ({ totalPages, currentPage, setPage }: ContentProps) => {
  const { useTranslationStore, useAdminListUsersStore } = useUserManagementStore()

  const { users } = useAdminListUsersStore()

  const { loadingStates } = useStates()
  const { isFetchingUsers } = loadingStates

  const { t } = useTranslationStore()

  if (!isFetchingUsers && users?.length === 0) {
    return <EmptyState />
  }

  return (
    <SandboxLayout.Content className="mx-auto max-w-[1092px]" paddingClassName="px-0">
      <Spacer size={7} />
      <h1 className="text-2xl font-medium text-foreground-1">
        {t('views:userManagement.usersHeader', 'Users')}{' '}
        <span className="text-foreground-4">({users?.length || 0})</span>
      </h1>
      <Spacer size={6} />
      <Actions />
      <Spacer size={4.5} />
      <UsersList />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        goToPage={(pageNum: number) => setPage(pageNum)}
        t={t}
      />
    </SandboxLayout.Content>
  )
}
