import { IUserManagementPageProps, SandboxLayout } from '@/views/index'
import { Dialogs } from '@/views/user-management/components/dialogs'
import { Content } from '@/views/user-management/components/page-components/content'
import { useUserManagementStore } from '@/views/user-management/providers/store-provider'

export const UserManagementPageContent = ({ handlers }: Pick<IUserManagementPageProps, 'handlers'>) => {
  const { useAdminListUsersStore } = useUserManagementStore()

  const { totalPages, page: currentPage, setPage } = useAdminListUsersStore()

  return (
    <SandboxLayout.Main className="max-w-[1092px]">
      <Content totalPages={totalPages} currentPage={currentPage} setPage={setPage} />
      <Dialogs handlers={handlers} />
    </SandboxLayout.Main>
  )
}
