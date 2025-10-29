import { IUserManagementPageProps, SandboxLayout } from '@/views'
import { Dialogs } from '@/views/user-management/components/dialogs'
import { Content } from '@/views/user-management/components/page-components/content'

export const UserManagementPageContent = ({
  handlers,
  searchQuery,
  setSearchQuery
}: Pick<IUserManagementPageProps, 'handlers' | 'searchQuery' | 'setSearchQuery'>) => {
  return (
    <SandboxLayout.Main>
      <Content searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Dialogs handlers={handlers} />
    </SandboxLayout.Main>
  )
}
