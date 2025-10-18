import { IUserManagementPageProps, SandboxLayout } from '@/views'
import { Dialogs } from '@/views/user-management/components/dialogs'
import { Content } from '@/views/user-management/components/page-components/content'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

export const UserManagementPageContent = ({
  handlers,
  searchQuery,
  setSearchQuery
}: Pick<IUserManagementPageProps, 'handlers' | 'searchQuery' | 'setSearchQuery'>) => {
  const { useAdminListUsersStore } = useUserManagementStore()

  const { totalItems, pageSize, page: currentPage, setPage } = useAdminListUsersStore()

  return (
    <SandboxLayout.Main>
      <Content
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        setPage={setPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Dialogs handlers={handlers} />
    </SandboxLayout.Main>
  )
}
